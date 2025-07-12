/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { z } from 'zod';
import { createAzure } from '@ai-sdk/azure';
import { generateObject } from 'ai';

export interface SnapshotDigestConfig {
  enabled: boolean;
  deploymentName?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  goal?: string;
}

// Schema for goal-focused digest
const goalFocusedSchema = z.object({
  summary: z.string().describe('Brief summary focusing on how the page relates to the goal'),
  relevantElements: z.array(z.object({
    type: z.string(),
    ariaRef: z.string(),
    description: z.string(),
    reason: z.string().describe('Why this element is relevant to the goal'),
  })).describe('ONLY elements directly relevant to achieving the user goal'),
  suggestedActions: z.array(z.string()).describe('Step-by-step actions to achieve the goal'),
});

// Schema for comprehensive digest (no goal)
const comprehensiveSchema = z.object({
  summary: z.string().describe('Brief summary of the page content and purpose'),
  mainContent: z.array(z.object({
    type: z.enum(['heading', 'text', 'section']),
    content: z.string(),
    level: z.number().optional(),
  })).describe('Main content areas with hierarchy'),
  interactiveElements: z.array(z.object({
    type: z.enum(['button', 'link', 'input', 'select', 'textarea', 'checkbox', 'radio']),
    ariaRef: z.string().describe('The aria-ref attribute value'),
    text: z.string().describe('Text or label of the element'),
    attributes: z.record(z.string(), z.string()).optional().describe('Important attributes like href, value, etc'),
  })).describe('All interactive elements with their aria-ref preserved'),
  forms: z.array(z.object({
    ariaRef: z.string().optional(),
    fields: z.array(z.object({
      type: z.string(),
      ariaRef: z.string(),
      label: z.string(),
      required: z.boolean().optional(),
    })),
  })).optional().describe('Form structures if present'),
  navigation: z.array(z.object({
    ariaRef: z.string(),
    text: z.string(),
    href: z.string().optional(),
  })).optional().describe('Navigation elements'),
});

export class SnapshotDigestService {
  private azure?: ReturnType<typeof createAzure>;
  private deploymentName: string = 'gpt-4o-mini';
  private maxTokens: number = 1500;
  private temperature: number = 0.3;
  private systemPrompt: string = `You are a web page analyzer. Your task is to digest a web page accessibility snapshot into a structured format.

CRITICAL REQUIREMENTS:
1. PRESERVE ALL aria-ref="[number]" attributes exactly as they appear
2. When a GOAL is specified:
   - ONLY include elements directly relevant to achieving that goal
   - Fill ONLY the goalRelevance section
   - Leave mainContent, interactiveElements, forms, and navigation empty/null
   - Be extremely selective - include only what's necessary for the goal
3. When NO GOAL is specified:
   - Extract ALL interactive elements (buttons, links, inputs, etc.)
   - Maintain the page's hierarchical structure
   - Include all sections (mainContent, interactiveElements, forms, navigation)

Focus on creating a minimal, goal-focused digest when a goal is provided, or a comprehensive digest when no goal is specified.`;

  constructor(private config: SnapshotDigestConfig) {
    if (!config.enabled)
      return;

    // Initialize Azure AI SDK
    const apiKey = process.env.AZURE_API_KEY;
    const resourceName = process.env.AZURE_RESOURCE_NAME;

    if (!apiKey || !resourceName) {
      console.error('Azure credentials missing. Please set AZURE_API_KEY and AZURE_RESOURCE_NAME environment variables.');
      return;
    }

    console.error(`Initializing Azure AI snapshot digest service with deployment: ${config.deploymentName || 'gpt-4o-mini'}`);

    this.azure = createAzure({
      apiKey,
      resourceName,
    });

    this.deploymentName = config.deploymentName || 'gpt-4o-mini';
    this.maxTokens = config.maxTokens || 1500;
    this.temperature = config.temperature || 0.3;
    if (config.systemPrompt)
      this.systemPrompt = config.systemPrompt;
  }

  async digest(snapshot: string, context?: string, navigationGoal?: string): Promise<string> {
    if (!this.config.enabled || !this.azure)
      return snapshot;

    try {
      // Build the prompt with goal-specific instructions
      let prompt = `Analyze and digest this web page snapshot into a structured format. ${context ? `Context: ${context}` : ''}`;

      // Use navigation goal if provided, otherwise fall back to config goal
      const goal = navigationGoal || this.config.goal;

      if (goal) {
        prompt += `\n\nUSER'S GOAL: ${goal}`;
        prompt += '\n\nCRITICAL INSTRUCTIONS:';
        prompt += '\n- ONLY include elements and content that are directly relevant to achieving this goal';
        prompt += '\n- EXCLUDE all unrelated elements, even if they are interactive';
        prompt += '\n- Focus exclusively on elements that help accomplish the specified goal';
        prompt += '\n- Omit navigation menus, footers, and other elements unless they directly relate to the goal';
        prompt += '\n- The output should be minimal and laser-focused on the goal';
      }

      prompt += `\n\nSNAPSHOT:\n${snapshot}\n\nRemember to preserve ALL aria-ref attributes exactly as they appear in the original snapshot.`;

      // Use different schema based on whether goal is specified
      if (goal) {
        const result = await generateObject({
          model: this.azure(this.deploymentName),
          schema: goalFocusedSchema,
          system: this.systemPrompt,
          prompt,
          maxTokens: this.maxTokens,
          temperature: this.temperature,
        });

        // Format goal-focused digest
        return this.formatGoalFocusedDigest(result.object as z.infer<typeof goalFocusedSchema>, goal);
      } else {
        const result = await generateObject({
          model: this.azure(this.deploymentName),
          schema: comprehensiveSchema,
          system: this.systemPrompt,
          prompt,
          maxTokens: this.maxTokens,
          temperature: this.temperature,
        });

        // Format comprehensive digest
        return this.formatComprehensiveDigest(result.object as z.infer<typeof comprehensiveSchema>);
      }
    } catch (error) {
      // Fall back to original snapshot if digestion fails
      return snapshot;
    }
  }

  private formatGoalFocusedDigest(digest: z.infer<typeof goalFocusedSchema>, goal: string): string {
    const lines: string[] = [];

    // Add summary
    lines.push(`# ${digest.summary}`);
    lines.push('');
    
    // Goal section
    lines.push('## 🎯 Goal');
    lines.push(`**${goal}**`);
    lines.push('');

    // Relevant elements
    if (digest.relevantElements.length > 0) {
      lines.push('## Relevant Elements');
      digest.relevantElements.forEach(el => {
        lines.push(`- **${el.type}** "${el.description}" [aria-ref="${el.ariaRef}"]`);
        lines.push(`  → ${el.reason}`);
      });
      lines.push('');
    }

    // Suggested actions
    if (digest.suggestedActions.length > 0) {
      lines.push('## Suggested Actions');
      digest.suggestedActions.forEach((action, idx) => {
        lines.push(`${idx + 1}. ${action}`);
      });
    }

    return lines.join('\n');
  }

  private formatComprehensiveDigest(digest: z.infer<typeof comprehensiveSchema>): string {
    const lines: string[] = [];

    // Add summary
    lines.push(`# ${digest.summary}`);
    lines.push('');

    // Add main content
    if (digest.mainContent && digest.mainContent.length > 0) {
      lines.push('## Content');
      digest.mainContent.forEach(item => {
        if (item.type === 'heading') {
          const prefix = '#'.repeat((item.level || 1) + 2);
          lines.push(`${prefix} ${item.content}`);
        } else if (item.type === 'section') {
          lines.push(`### ${item.content}`);
        } else {
          lines.push(`- ${item.content}`);
        }
      });
      lines.push('');
    }

    // Add navigation
    if (digest.navigation && digest.navigation.length > 0) {
      lines.push('## Navigation');
      digest.navigation.forEach(nav => {
        lines.push(`- link "${nav.text}" [aria-ref="${nav.ariaRef}"]${nav.href ? ` href="${nav.href}"` : ''}`);
      });
      lines.push('');
    }

    // Add forms
    if (digest.forms && digest.forms.length > 0) {
      lines.push('## Forms');
      digest.forms.forEach((form, idx) => {
        lines.push(`### Form ${idx + 1}${form.ariaRef ? ` [aria-ref="${form.ariaRef}"]` : ''}`);
        form.fields.forEach(field => {
          lines.push(`- ${field.type} "${field.label}" [aria-ref="${field.ariaRef}"]${field.required ? ' (required)' : ''}`);
        });
      });
      lines.push('');
    }

    // Add interactive elements
    if (digest.interactiveElements.length > 0) {
      lines.push('## Interactive Elements');
      const elementsByType = digest.interactiveElements.reduce((acc, el) => {
        if (!acc[el.type])
          acc[el.type] = [];
        acc[el.type].push(el);
        return acc;
      }, {} as Record<string, typeof digest.interactiveElements>);

      Object.entries(elementsByType).forEach(([type, elements]) => {
        lines.push(`### ${type.charAt(0).toUpperCase() + type.slice(1)}s`);
        elements.forEach(el => {
          let line = `- ${el.type} "${el.text}" [aria-ref="${el.ariaRef}"]`;
          if (el.attributes) {
            Object.entries(el.attributes).forEach(([key, value]) => {
              line += ` ${key}="${value}"`;
            });
          }
          lines.push(line);
        });
      });
    }

    return lines.join('\n');
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Configuration schema for validation
export const snapshotDigestConfigSchema = z.object({
  enabled: z.boolean().default(false),
  deploymentName: z.string().optional(),
  maxTokens: z.number().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
  systemPrompt: z.string().optional(),
});

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

import * as playwright from 'playwright';
import { callOnPageNoTrace } from './tools/utils.js';
import { SnapshotDigestService } from './snapshotDigest.js';

type PageEx = playwright.Page & {
  _snapshotForAI: () => Promise<string>;
};

export class PageSnapshot {
  private _page: playwright.Page;
  private _text!: string;
  private _originalText!: string;
  private _digestService?: SnapshotDigestService;
  private _navigationGoal?: string;

  constructor(page: playwright.Page, digestService?: SnapshotDigestService, navigationGoal?: string) {
    this._page = page;
    this._digestService = digestService;
    this._navigationGoal = navigationGoal;
  }

  static async create(page: playwright.Page, digestService?: SnapshotDigestService, navigationGoal?: string): Promise<PageSnapshot> {
    const snapshot = new PageSnapshot(page, digestService, navigationGoal);
    await snapshot._build();
    return snapshot;
  }

  text(): string {
    return this._text;
  }

  originalText(): string {
    return this._originalText;
  }

  private async _build() {
    const snapshot = await callOnPageNoTrace(this._page, page => (page as PageEx)._snapshotForAI());

    // Store original snapshot
    this._originalText = [
      `- Page Snapshot (Original)`,
      '```yaml',
      snapshot,
      '```',
    ].join('\n');

    // Try to digest the snapshot if service is available
    let processedSnapshot = snapshot;
    if (this._digestService && this._digestService.isEnabled()) {
      try {
        const pageUrl = this._page.url();
        const pageTitle = await this._page.title();
        const context = `URL: ${pageUrl}, Title: ${pageTitle}`;
        console.error(`Digesting snapshot for ${pageUrl}...`);
        
        // Pass the navigation goal to the digest service
        processedSnapshot = await this._digestService.digest(snapshot, context, this._navigationGoal);
        
        console.error(`Snapshot digested: ${snapshot.length} -> ${processedSnapshot.length} characters`);
      } catch (error) {
        console.error('Failed to digest snapshot:', error);
        // Fall back to original snapshot
        processedSnapshot = snapshot;
      }
    }

    this._text = [
      `- Page Snapshot${this._digestService?.isEnabled() ? ' (Digested)' : ''}`,
      '```yaml',
      processedSnapshot,
      '```',
    ].join('\n');
  }

  refLocator(params: { element: string, ref: string }): playwright.Locator {
    return this._page.locator(`aria-ref=${params.ref}`).describe(params.element);
  }
}

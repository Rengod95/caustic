import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'analytics-dashboard',
  title: 'Analytics dashboard',
  intent: 'An admin analytics page: filters, headline metrics, charts, a sortable account table and an activity feed.',
  regions: [
    {
      placement: 'page',
      purpose: 'Page header with the title, the data freshness line and the page-level actions.',
      roles: ['layout.structure', 'action.primary', 'action.secondary'],
      suggested: ['section-header', 'button'],
    },
    {
      placement: 'page',
      purpose: 'A dismissible page alert when the data is incomplete or stale, with a recovery action.',
      roles: ['feedback.inline'],
      suggested: ['alert', 'button'],
    },
    {
      placement: 'page',
      purpose: 'One filter bar for the whole page: search, pickers, a date range, plan and status toggles, tags.',
      roles: ['input.text', 'input.pick', 'input.date', 'choice.single', 'choice.multi'],
      suggested: ['input', 'select', 'combobox', 'date-picker', 'segmented-control', 'chip', 'tag-input', 'button'],
    },
    {
      placement: 'page',
      purpose: 'A row of headline metrics, each with its change and a short trend.',
      roles: ['display.metric'],
      suggested: ['card-stat'],
    },
    {
      placement: 'card',
      purpose: 'Charts inside cards, with a small switch for the measure shown and a short summary under the chart.',
      roles: ['layout.container', 'display.data', 'choice.single'],
      suggested: ['card', 'segmented-control', 'alert'],
    },
    {
      placement: 'page',
      purpose: 'The account table: sort, select, page, row menus, status badges and an empty state when filters match nothing.',
      roles: ['collection.list', 'display.data', 'display.status', 'feedback.empty'],
      suggested: ['section-header', 'table', 'badge', 'progress', 'menu', 'icon-button', 'empty-state'],
    },
    {
      placement: 'card',
      purpose: 'Recent activity by people and the agent, paged, beside a card that is still loading.',
      roles: ['collection.list', 'display.identity', 'feedback.progress'],
      suggested: ['card', 'timeline', 'avatar', 'pagination', 'skeleton', 'badge'],
    },
  ],
  notes: [
    'There is no chart component: draw charts with the chart-1 to chart-6 colour tokens inside a Card.',
    'One primary action in the page header; the other header and toolbar actions stay secondary or ghost.',
    'Filters reset the table to page one and offer a way to clear them all.',
    'Show loading with Skeleton in the final layout, not a spinner over the page.',
  ],
  reference: 'apps/docs/src/showcase/samples/dashboard.tsx',
});

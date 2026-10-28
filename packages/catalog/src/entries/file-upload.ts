import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'file-upload',
  intent: 'Collect files through a drop zone and list each one with its upload progress, completion or failure.',
  roles: ['input.file'],
  alsoFits: ['feedback.progress', 'collection.list'],
  placement: ['form', 'overlay', 'page', 'end'],
  keywords: ['dropzone', 'drag and drop', 'attachment', 'uploader', 'file picker', 'attach files', 'upload queue'],
  pairs: ['field', 'dialog', 'button', 'progress'],
  consider: [
    { id: 'import-panel', when: 'the files bring an existing design into the canvas' },
    { id: 'composer', when: 'files are attached to a message for the agent' },
  ],
  guidance: [
    'It reports the chosen files; the app uploads them and feeds back each row with its status and progress.',
    'Write the allowed formats and size limit inside the drop zone; a failed row says why and offers Remove.',
  ],
});

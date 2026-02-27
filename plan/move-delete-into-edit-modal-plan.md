# Move Delete Into Edit Modal Plan

This plan addresses code review item 4:

`The edit and delete interaction diverges from the provided spec.`

## Goal

Change the current delete flow so delete is initiated from inside the `Edit patient` modal, matching the spec sketch more closely.

Current flow:

1. User clicks delete in the table or mobile card
2. Separate delete confirmation dialog opens
3. User confirms delete there

Target flow:

1. User clicks edit in the table or mobile card
2. `Edit patient` modal opens
3. A delete action is available inside the edit modal
4. User can delete from that modal

## Proposed UX

### Edit Modal Behavior

The `Edit patient` modal will contain:

1. existing form fields
2. existing `Close` button
3. existing `Save` button
4. a visible `Delete` action inside the modal, shown only in `edit` mode

Recommended placement:

1. `Delete` button in the modal action row
2. visually separated from `Close` and `Save`
3. styled as destructive (`color='error'`)

This keeps the interaction close to the spec without redesigning the whole modal.

### Confirmation Behavior

There are two viable options:

1. Direct delete from the edit modal action row
2. Delete button in the edit modal opens a lightweight confirmation step inside the same modal

Recommended option:

1. Keep a confirmation step, but keep it inside the edit modal flow

That means:

1. no separate standalone `DeleteClientDialog`
2. the edit modal itself can switch into a confirm-delete substate, or show an inline warning block before final delete

This preserves safety while still matching the spec intent.

## Recommended Technical Approach

### 1. Remove delete as a separate modal flow

Current delete state in `ClientsPage`:

1. `deleteTarget`
2. `deleteError`
3. `onOpenDeleteDialog`
4. `onCloseDeleteDialog`
5. `onConfirmDelete`
6. separate `DeleteClientDialog` render

We should collapse this into the edit modal flow.

Target file:

1. `src/components/clients/clients-page.tsx`

### 2. Extend `ClientModal` to support delete in edit mode

Add props to `ClientModal`:

1. `onDelete?: () => Promise<void>`
2. `isDeleting?: boolean`
3. `deleteError?: string | null`

Behavior:

1. only render delete UI when `mode === 'edit'`
2. disable modal actions while delete is pending
3. show delete-related error inline in the modal

Target file:

1. `src/components/clients/client-modal.tsx`

### 3. Keep table actions simple

Table and mobile cards should still expose both actions:

1. edit
2. delete

But to match the new flow, the delete icon should no longer open a separate dialog.

Recommended behavior:

1. clicking delete from the table opens the same edit modal, but in `edit` mode with delete available and delete intent pre-armed

Alternative simpler behavior:

1. clicking delete from the table just opens the edit modal for that client
2. user must then press delete inside the modal

Recommended choice:

1. simpler behavior: table delete button opens edit modal
2. no hidden pre-armed destructive state

That is safer and easier to understand.

Target file:

1. `src/components/clients/client-table.tsx`

Note:

This may not require changing `client-table.tsx` if the table’s delete callback is remapped in `ClientsPage`.

### 4. Remove `DeleteClientDialog`

Once delete is fully owned by `ClientModal`, the separate dialog becomes dead code.

Target file:

1. `src/components/clients/delete-client-dialog.tsx`

Planned action:

1. remove usages first
2. then delete the file if no references remain

## Concrete State Flow

### In `ClientsPage`

Recommended state changes:

1. remove `deleteTarget`
2. remove delete dialog open/close state
3. keep `deleteError`
4. when user clicks delete on a row:
   - open `ClientModal` in `edit` mode for that client
5. pass a delete handler into `ClientModal`
6. in that handler:
   - call `deleteClientMutation`
   - close the modal on success
   - keep modal open and show error on failure

### In `ClientModal`

Recommended local UI state:

1. `isConfirmingDelete: boolean`

Flow:

1. first click on `Delete` toggles confirm state
2. modal shows an inline warning message
3. button label changes to `Confirm delete`
4. second click executes delete
5. `Close` can cancel the confirmation state if desired

This avoids an extra modal while keeping a confirmation step.

## Files Expected To Change

1. `src/components/clients/clients-page.tsx`
2. `src/components/clients/client-modal.tsx`
3. possibly `src/components/clients/client-table.tsx` only if callback naming should be clarified
4. `src/components/clients/delete-client-dialog.tsx` should become removable
5. `plan/code-review.md` should be updated after implementation

## Risks

1. Mixing form submit and delete logic in one modal can make the component more complex
2. If delete confirmation is too subtle, destructive action risk increases
3. If delete state is not reset when the modal closes, the next edit session could open in the wrong substate

## Acceptance Criteria

1. There is no separate delete dialog in the UI flow
2. Delete is available only in `edit` mode inside `ClientModal`
3. Deleting from the modal removes the client and closes the modal on success
4. Delete errors appear inside the modal
5. Add mode does not show any delete affordance
6. Existing create and save flows still work

## Questions Before Implementation

1. Do you want delete to require a two-step confirmation inside the edit modal, or should a single delete click execute immediately? yes
2. When the user clicks the delete icon in the table, should it:
   - open the edit modal normally
   - open the edit modal with delete confirmation already shown yes
3. Do you want the delete button placed:
   - on the left side of the action row
   - on the top-right near the title, closer to the sketch  yes

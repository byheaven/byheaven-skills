import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { actionKeys, reminder, sessionContext } from '../hooks/lifecycle.mjs';

export default function taskLifecycle(pi: ExtensionAPI) {
  pi.registerFlag('manager-role', { description: 'Assigned session role for completion checks', type: 'string' });
  let completionChecked = false;
  let active = false;

  pi.on('before_agent_start', (event) => {
    completionChecked = false;
    active = false;
    event.systemPromptOptions.sections.task_owner_role = sessionContext();
  });

  pi.on('tool_call', (event) => {
    const keys = actionKeys(event.toolName, event.input);
    if (!keys.length) return;
    active = true;
    pi.sendMessage({ customType: 'manager-action-check', content: reminder(keys), display: false });
  });

  pi.on('agent_before_settle', (event) => {
    if (pi.getFlag('manager-role') !== 'task-owner' || !active || event.outcome !== 'completed' || completionChecked) return;
    completionChecked = true;
    return {
      entries: [...event.entries, {
        type: 'custom_message',
        customType: 'manager-completion-check',
        content: reminder(['Finish']),
        display: false,
      }],
      continue: true,
    };
  });
}

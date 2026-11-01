import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { actionKeys, reminder, sessionContext } from '../hooks/lifecycle.mjs';

export default function taskLifecycle(pi: ExtensionAPI) {
  let completionChecked = false;

  pi.on('before_agent_start', (event) => {
    completionChecked = false;
    event.systemPromptOptions.sections.task_owner_role = sessionContext();
  });

  pi.on('tool_call', (event) => {
    const keys = actionKeys(event.toolName, event.input);
    if (keys.length) pi.sendMessage({ customType: 'manager-action-check', content: reminder(keys), display: false });
  });

  pi.on('agent_before_settle', (event) => {
    if (event.outcome !== 'completed' || completionChecked) return;
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

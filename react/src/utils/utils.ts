import { State, Status } from "../types/types";

export const getBackgroundGif = ({ type, status }: { type: State, status: Status }) => {
  if (type === 'pending' && status === 'focusing') {
    return `linear-gradient(to bottom, rgba(66,18, 18, .85), rgba(66,18, 18, .85)), url("./img/cyberpunk-1.gif")`;
  }

  if (type === 'pending' && status === 'resting') {
    return `linear-gradient(to bottom, rgba(18,42, 66, .85), rgba(18,42, 66, .85)), url("./img/rest.gif")`;
  }

  if (status === 'focusing' && type === 'finish') {
    return `linear-gradient(to bottom, rgba(66,63, 18, .85), rgba(66,63, 18, .85)), url("./img/finish.gif")`;
  }

  return `linear-gradient(to right, rgb(54 5 78 / 70%), rgb(34 2 56 / 87%)), url(./img/pattern.png)`;
};

export const getAppStorageStatus = async () => {
  const { type = 'not-started', status = 'focusing' } = await chrome.storage.local.get(null);
  const statusColor = {
    color: 'rgb(74 31 76)',
    badge: 'purple',
  }

  switch (type) {

    case 'finish':
      if (status === 'resting') {
        statusColor.color = 'rgb(74 31 76)';
        statusColor.badge = 'purple';
      } else {
        statusColor.color = 'rgb(137 116 0)';
        statusColor.badge = 'yellow';
      }
      break;

    case 'pending':
      if (status === 'focusing') {
        statusColor.color = 'rgb(111 13 13)';
        statusColor.badge = 'red';
      } else {
        statusColor.color = '#476db2';
        statusColor.badge = 'blue';
      }
      break;

    case 'not-started':
    default:
      statusColor.color = 'rgb(74 31 76)';
      statusColor.badge = 'purple';
      break;
  }

  return {
    type,
    status,
    ...statusColor,
  };
};

export const getAppSyncPeriods = async () => {
  const params = await chrome.storage.sync.get(null);

  const focusPeriod = params.focusPeriod || '35';
  const restPeriod = params.restPeriod || '8';

  return {
    focusPeriod,
    restPeriod,
  };
};

export const setBadgeIconByColor = (color: string) => {
  chrome.action.setIcon({
    path: {
      "16": `./icons/${color}/16-${color}.png`,
      "32": `./icons/${color}/32-${color}.png`,
      "48": `./icons/${color}/48-${color}.png`,
      "128": `./icons/${color}/128-${color}.png`,
    }
  });
};
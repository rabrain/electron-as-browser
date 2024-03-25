import { IpcRendererEvent, ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import type { TabID, Tab, Tabs } from './index.d.ts';

// Used in Renderer process

const noop = () => { };

interface Options {
  onTabsUpdate?: (tab: Tab) => void
  onTabActive?: (tab: Tab) => void
}

type Listener = (event: IpcRendererEvent, ...args: any[]) => void

/**
 * A custom hook to create ipc connection between BrowserView and ControlView
 *
 * @param {object} options
 * @param {function} options.onTabsUpdate - trigger after tabs updated(title, favicon, loading etc.)
 * @param {function} options.onTabActive - trigger after active tab changed
 */
export default function useConnect(options: Options | undefined = {}) {
  const { onTabsUpdate = noop, onTabActive = noop } = options;
  const [tabs, setTabs] = useState({} as Tabs);
  const [tabIDs, setTabIDs] = useState([] as TabID[]);
  const [activeID, setActiveID] = useState(0 as TabID);

  const channels: Record<string, Listener> = {
    'tabs-update':
      (e, v) => {
        setTabIDs(v.tabs);
        setTabs(v.confs);
        onTabsUpdate(v);
      },
    'active-update':
      (e, v) => {
        setActiveID(v);
        const activeTab = tabs[v]
        onTabActive(activeTab);
      }
  };

  useEffect(() => {
    ipcRenderer.send('control-ready');

    Object.entries(channels).forEach(([name, listener]) => ipcRenderer.on(name, listener));

    return () => {
      Object.entries(channels).forEach(([name, listener]) => ipcRenderer.removeListener(name, listener));
    };
  }, []);

  return { tabIDs, tabs, activeID };
};

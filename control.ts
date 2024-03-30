import { ipcRenderer } from 'electron';
import { type TabID } from './index.js';

// Used in Renderer process

/**
 * Tell browser view to load url
 * @param {string} url
 */
const sendEnterURL = (url: string) => ipcRenderer.send('url-enter', url);

/**
 * Tell browser view url in address bar changed
 * @param {string} url
 */
const sendChangeURL = (url: string) => ipcRenderer.send('url-change', url);

const sendAct = (actName: string) => {
  ipcRenderer.send('act', actName);
};

/**
 * Tell browser view to goBack
 */
const sendGoBack = () => sendAct('goBack');

/**
 * Tell browser view to goForward
 */
const sendGoForward = () => sendAct('goForward');

// Tell browser view to reload
const sendReload = () => sendAct('reload');

// Tell browser view to stop load
const sendStop = () => sendAct('stop');

/**
 * Tell browser view to close tab
 * @param {TabID} id
 */
const sendCloseTab = (id: TabID) => ipcRenderer.send('close-tab', id);

/**
 * Create a new tab
 * @param {string} [url]
 * @param {object} [references]
 */
const sendNewTab = (url?: string, references?: object) => ipcRenderer.send('new-tab', url, references);

/**
 * Tell browser view to switch to specified tab
 * @param {TabID} id
 */
const sendSwitchTab = (id: TabID) => ipcRenderer.send('switch-tab', id);

export default {
  sendEnterURL, // sendEnterURL(url) to load url
  sendChangeURL, // sendChangeURL(url) on addressbar input change
  sendGoBack,
  sendGoForward,
  sendReload,
  sendStop,
  sendNewTab, // sendNewTab([url])
  sendSwitchTab, // sendSwitchTab(toID)
  sendCloseTab // sendCloseTab(id)
};

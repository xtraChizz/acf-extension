import { Runtime } from "common-extension";
import { Port } from "common-extension/dist/chrome/runtime";

export const Connect = Runtime.connect({ name: chrome.runtime.id });
Connect.onMessage.addListener((message: any, port: Port) => {

})
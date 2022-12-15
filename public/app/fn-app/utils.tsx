import { FC, useState } from 'react';
import ReactDOM from 'react-dom';

export interface RenderPortalProps {
  ID: string;
}

export declare type PortalEffectReturn = {
  portalDiv: HTMLElement | null;
}

export const getPortalContainer = (ID: string): HTMLElement | null => document.getElementById(ID);

export const RenderPortal: FC<RenderPortalProps> = ({ ID, children }) => {
  const portalDiv = getPortalContainer(ID)
  
  if(!portalDiv){
    return null;
  }

  return ReactDOM.createPortal(children, portalDiv);
};

const HIDDEN_VARIABLES_KEY = 'fn-storage-hidden-filters';

export const useHiddenVariables = () =>{
  const storage = window.localStorage;
  const [ hiddenVariables, setHiddenVariables] = useState([]);

  window.addEventListener(HIDDEN_VARIABLES_KEY, () =>{
    setHiddenVariables(JSON.parse(storage.getItem(HIDDEN_VARIABLES_KEY) || "[]"))
  });

  return { hiddenVariables }
}


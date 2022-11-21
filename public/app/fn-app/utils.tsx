import { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface RenderPortalProps {
  ID: string;
}

export declare type PortalEffectReturn = {
  portalDiv: HTMLElement | null;
}

export type UsePortalEffect = (ID: string) => PortalEffectReturn;

const usePortalEffect: UsePortalEffect = ( ID ) =>{
  const [ portalEffectReturn ,setContainer] = useState<PortalEffectReturn>({ portalDiv: null } );
  useEffect(() =>{

    const getContainer = (ID: string): HTMLElement | null => document.getElementById(ID);
    const container: HTMLElement | null = getContainer(ID)
    if(container){
      setContainer({
        portalDiv: container,
      });
    }
  }, [ID])

  return portalEffectReturn 
}

export const RenderPortal: FC<RenderPortalProps> = ({ ID, children }) => {
  const { portalDiv } = usePortalEffect(ID);
  
  if(!portalDiv){
    return null;
  }

  return ReactDOM.createPortal(children, portalDiv);
};


import { css, cx } from '@emotion/css';
import { PropsWithChildren, useLayoutEffect, useRef } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { GrafanaTheme2 } from '@grafana/data';

import { useStyles2, useTheme2 } from '../../themes';

interface Props {
  className?: string;
  root?: HTMLElement;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
}

export const Portal: React.FC<PropsWithChildren<Props>> = (props) => {
  const { children, className, root, forwardedRef } = props;
  const theme = useTheme2();
  const node = useRef<HTMLDivElement | null>(null);
  const portalRoot = root ?? getPortalContainer();

  if (!node.current) {
    node.current = document.createElement('div');
    if (className) {
      node.current.className = className;
    }
    node.current.style.position = 'relative';
    node.current.style.zIndex = `${theme.zIndex.portal}`;
  }

  useLayoutEffect(() => {
    if (node.current) {
      portalRoot.appendChild(node.current);
    }

    return () => {
      if (node.current) {
        portalRoot.removeChild(node.current);
      }
    };
  }, [portalRoot]);

  return ReactDOM.createPortal(
    <div data-qiankun="grafana-full-app" ref={forwardedRef}>
      {children}
    </div>,
    node.current
  );
}

/** @internal */
export function getPortalContainer() {
  return window.document.getElementById('grafana-portal-container') ?? document.body;
}

/** @internal */
export function PortalContainer() {
  const styles = useStyles2(getStyles);
  const isBodyScrolling = window.grafanaBootData?.settings.featureToggles.bodyScrolling;
  return (
    <div
      id="grafana-portal-container"
      className={cx({
        [styles.grafanaPortalContainer]: isBodyScrolling,
      })}
    />
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  grafanaPortalContainer: css({
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: theme.zIndex.portal,
  }),
});

export const RefForwardingPortal = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <Portal {...props} forwardedRef={ref} />;
});

RefForwardingPortal.displayName = 'RefForwardingPortal';

import { css, cx } from '@emotion/css';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { GrafanaTheme2, isIconName } from '@grafana/data';

import { useStyles2 } from '../../themes/ThemeContext';
import { IconName, IconType, IconSize } from '../../types/icon';
import { spin } from '../../utils/keyframes';

import { getIconRoot, getIconSubDir, getSvgSize } from './utils';

export interface IconProps extends Omit<React.SVGProps<SVGElement>, 'onLoad' | 'onError' | 'ref'> {
  name: IconName;
  size?: IconSize;
  type?: IconType;
  /**
   * Give your icon a semantic meaning. The icon will be hidden from screen readers, unless this prop or an aria-label is provided.
   */
  title?: string;
}

const getIconStyles = (theme: GrafanaTheme2) => {
  return {
    icon: css({
      display: 'inline-block',
      fill: 'currentColor',
      flexShrink: 0,
      label: 'Icon',
      // line-height: 0; is needed for correct icon alignment in Safari
      lineHeight: 0,
      verticalAlign: 'middle',
    }),
    orange: css({
      fill: theme.v1.palette.orange,
    }),
    spin: css({
      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        animation: `${spin} 2s infinite linear`,
      },
    }),
  };
};

export const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ size = 'md', type = 'default', name, className, style, title = '', ...divElementProps }, ref): JSX.Element => {
    const styles = useStyles2(getIconStyles);

    /* Temporary solution to display also font awesome icons */
    if (name?.startsWith('fa fa-')) {
      /* @ts-ignore */
      return <i className={getFontAwesomeIconStyles(name, className)} {...divElementProps} style={style} />;
    }

    if (!cacheInitialized) {
      initIconCache();
    }

    if (!isIconName(name)) {
      console.warn('Icon component passed an invalid icon name', name);
    }

    // handle the deprecated 'fa fa-spinner'
    const iconName: IconName = name === 'fa fa-spinner' ? 'spinner' : name;

    const iconRoot = getIconRoot();
    const svgSize = getSvgSize(size);
    const svgHgt = svgSize;
    const svgWid = name.startsWith('gf-bar-align') ? 16 : name.startsWith('gf-interp') ? 30 : svgSize;
    const subDir = getIconSubDir(iconName, type);
    const svgPath = `${iconRoot}${subDir}/${iconName}.svg`;

    const composedClassName = cx(
      styles.icon,
      className,
      type === 'mono' ? { [styles.orange]: name === 'favorite' } : '',
      {
        [styles.spin]: iconName === 'spinner',
      }
    );

    return (
      <div className={styles.container} {...divElementProps} ref={ref}>
        {/* @ts-ignore */}
        <SVG
          src={svgPath}
          width={svgWid}
          height={svgHgt}
          title={title}
          className={cx(styles.icon, className, type === 'mono' ? { [styles.orange]: name === 'favorite' } : '')}
          style={style}
        />
      </div>
    );
  }
);

Icon.displayName = 'Icon';

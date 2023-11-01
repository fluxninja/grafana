import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, styled } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { useSelector } from 'app/types';

import { PickerRenderer } from '../../../variables/pickers/PickerRenderer';
import { VariableHide, VariableModel } from '../../../variables/types';

interface Props {
  variables: VariableModel[];
  readOnly?: boolean;
}

export const SubMenuItems = ({ variables, readOnly }: Props) => {
  const [visibleVariables, setVisibleVariables] = useState<VariableModel[]>([]);

  const hiddenVariables = useSelector((state) => state.fnGlobalState.hiddenVariables);

  useEffect(() => {
    setVisibleVariables(
      variables.filter((state) => state.hide !== VariableHide.hideVariable && !hiddenVariables?.includes(state.id))
    );
  }, [variables, hiddenVariables]);

  if (visibleVariables.length === 0) {
    return null;
  }

  return (
    <>
      <FilterWithIcon />
      {visibleVariables.map((variable) => {
        return (
          <div
            key={variable.id}
            className="submenu-item gf-form-inline"
            data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
          >
            <PickerRenderer variable={variable} readOnly={readOnly} />
          </div>
        );
      })}
    </>
  );
};

const FilterWithIcon: FC = () => (
  <FilterWithIconStyled>
    <FilterListIcon sx={{ color: '#3A785E' }} />
    FILTERS
  </FilterWithIconStyled>
);

const FilterWithIconStyled = styled(Box)({
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  color: '#3A785E',
  fontWeight: 600,
  lineHeight: '160%',
  fontSize: 12,
});

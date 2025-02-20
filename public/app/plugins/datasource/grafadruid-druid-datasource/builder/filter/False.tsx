import { useState } from 'react';

import { InfoBox } from '@grafana/ui';

import { useQueryBuilderAutoSubmit, Row } from '../abstract';
import { QueryBuilderProps } from '../types';

export const False = (props: QueryBuilderProps) => {
  useQueryBuilderAutoSubmit(props, False);
  const [showInfo, setShowInfo] = useState(true);
  return (
    <>
      {showInfo && (
        <Row>
          <InfoBox
            title="False"
            onDismiss={() => {
              setShowInfo(false);
            }}
          >
            <p>
              The false filter is a filter which matches no value. It can be used to temporarily disable other filters
              without removing the filter.
            </p>
          </InfoBox>
        </Row>
      )}
    </>
  );
};
False.type = 'false';
False.fields = [] as string[];

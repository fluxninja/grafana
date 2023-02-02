import React from 'react';

import { useScopedQueryBuilderFieldProps, Input, Row, QueryBuilderComponentSelector } from '../abstract';
import { QueryBuilderProps } from '../types';

import { FieldAccess, FinalizingFieldAccess, Javascript } from './';

export const QuantilesDoublesSketchToHistogram = (props: QueryBuilderProps) => {
  const scopedProps = useScopedQueryBuilderFieldProps(props, QuantilesDoublesSketchToHistogram);
  return (
    <>
      <Row>
        <Input {...scopedProps('name')} label="Name" description="Output name for the value" type="text" />
      </Row>
      <Row>
        <QueryBuilderComponentSelector
          {...scopedProps('field')}
          label="Field"
          components={{
            FieldAccess: FieldAccess,
            FinalizingFieldAccess: FinalizingFieldAccess,
            Javascript: Javascript,
          }}
        />
      </Row>
      <Row>
        <Input {...scopedProps('numBins')} label="NumberOfBins" description="number of bins" type="number" />
      </Row>
    </>
  );
};
QuantilesDoublesSketchToHistogram.type = 'quantilesDoublesSketchToHistogram';
QuantilesDoublesSketchToHistogram.fields = ['name', 'field', /*'splitPoints',*/ 'numBins'];

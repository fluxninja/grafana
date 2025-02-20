import { useScopedQueryBuilderFieldProps, Input, Row } from '../abstract';
import { QueryBuilderProps } from '../types';

export const Polygon = (props: QueryBuilderProps) => {
  const scopedProps = useScopedQueryBuilderFieldProps(props, Polygon);
  return (
    <Row>
      <Input
        {...scopedProps('abscissa')}
        label="Abscissa"
        description="Horizontal coordinate for corners of the polygon"
        type="number"
      />
      <Input
        {...scopedProps('ordinate')}
        label="Ordinate"
        description="Vertical coordinate for corners of the polygon"
        type="number"
      />
    </Row>
  );
};
Polygon.type = 'polygon';
Polygon.fields = ['abscissa', 'ordinate'];

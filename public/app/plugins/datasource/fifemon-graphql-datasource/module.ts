import { DataSourcePlugin } from '@grafana/data';

import { ConfigEditor } from './ConfigEditor';
import { FN_DataSource } from './FN_DataSource';
import { GraphQLAnnotationsQueryCtrl } from './GraphQLAnnotationsQueryCtrl';
import { QueryEditor } from './QueryEditor';
import { VariableQueryEditor } from './VariableQueryEditor';
import { MyQuery, MyDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<FN_DataSource, MyQuery, MyDataSourceOptions>(FN_DataSource)
  .setConfigEditor(ConfigEditor)
  .setAnnotationQueryCtrl(GraphQLAnnotationsQueryCtrl)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);

import { DataSourcePlugin } from '@grafana/data';
import { FN_DataSource } from './FN_DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { MyQuery, MyDataSourceOptions } from './types';
import { GraphQLAnnotationsQueryCtrl } from './GraphQLAnnotationsQueryCtrl';
import { VariableQueryEditor } from './VariableQueryEditor';

export const plugin = new DataSourcePlugin<FN_DataSource, MyQuery, MyDataSourceOptions>(FN_DataSource)
  .setConfigEditor(ConfigEditor)
  .setAnnotationQueryCtrl(GraphQLAnnotationsQueryCtrl)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);

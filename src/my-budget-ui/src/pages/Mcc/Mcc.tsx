import { FC } from 'react';
import Section from 'common/Section';
import data from './mcc.json';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface IMccGroup {
  type: string;
  description: string;

}

interface IMcc {
  mcc: string;
  group: IMccGroup;
  shortDescription: string;
  fullDescription: string;
}

const MCC: FC = () => {

  const columns: GridColDef[] = [
    {
      field: 'mcc',
      headerName: 'MCC'
    },
    {
      field: 'group.type',
      headerName: 'Type',
      valueGetter: (_, row) => row.group.type
    },
    {
      field: 'group.description',
      headerName: 'Type description',
      valueGetter: (_, row) => row.group.description
    },
    {
      field: 'shortDescription',
      headerName: 'Short description'
    },
    {
      field: 'fullDescription',
      headerName: 'Full description'
    },
  ];

  return (
    <Section>
      <DataGrid
        rows={data}
        getRowId={(_) => _.mcc}
        columns={columns}
        disableRowSelectionOnClick
      />
    </Section>
  );
};

export default MCC;
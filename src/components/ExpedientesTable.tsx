import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Expediente = {
  id: number;
  numero: string;
  anio: number;
  fecha: Date;
  asunto: string;
  estado: { nombre: string };
  tipo: { nombre: string };
  iniciador: string;
  observaciones: string | null;
};

const columnHelper = createColumnHelper<Expediente>();

const columns = [
  columnHelper.accessor('numero', {
    header: 'Número',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('anio', {
    header: 'Año',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('fecha', {
    header: 'Fecha',
    cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy', { locale: es }),
  }),
  columnHelper.accessor('asunto', {
    header: 'Asunto',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('estado.nombre', {
    header: 'Estado',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('tipo.nombre', {
    header: 'Tipo',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('iniciador', {
    header: 'Iniciador',
    cell: info => info.getValue(),
  }),
];

interface ExpedientesTableProps {
  expedientes: Expediente[];
  onView?: (expediente: Expediente) => void;
}

export default function ExpedientesTable({ expedientes, onView }: ExpedientesTableProps) {
  const table = useReactTable({
    data: expedientes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onView?.(row.original)}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(row.original);
                  }}
                  className="text-primary-600 hover:text-primary-900"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

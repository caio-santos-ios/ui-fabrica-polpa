import React, { ReactNode } from "react";

interface TableProps { children: ReactNode; className?: string; }
interface TableHeaderProps { children: ReactNode; className?: string; }
interface TableBodyProps { children: ReactNode; className?: string; }
interface TableRowProps { children: ReactNode; className?: string; }
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
}

const Table: React.FC<TableProps> = ({ children, className }) => (
  <table className={`min-w-full tele-table ${className ?? ""}`}>{children}</table>
);

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => (
  <thead className={`tele-table-thead ${className ?? ""}`}>{children}</thead>
);

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);

const TableRow: React.FC<TableRowProps> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
);

const TableCell: React.FC<TableCellProps> = ({ children, isHeader = false, className, colSpan }) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className} colSpan={colSpan}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };

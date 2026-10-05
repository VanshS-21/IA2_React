import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBorrowRecords } from "../api/borrow";
import type { BorrowStatus, PopulatedBorrowRecord } from "../types/models";
import type { Column } from "../components/common/DataTable";
import { Badge } from "../components/common/Badge";
import { DataTable } from "../components/common/DataTable";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Pagination } from "../components/common/Pagination";
import { Select } from "../components/common/Select";
import { useAsync } from "../hooks/useAsync";
import { useDebounce } from "../hooks/useDebounce";
import { formatDate } from "../utils/date";

const statusOptions: BorrowStatus[] = ["issued", "overdue", "returned"];

export function CirculationPage(): JSX.Element {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BorrowStatus | null>(null);
  const [page, setPage] = useState(1);
  const term = useDebounce(search);
  useEffect(() => setPage(1), [term, status]);
  const records = useAsync(
    () =>
      fetchBorrowRecords({
        search: term || undefined,
        status: status ?? undefined,
        page,
        limit: 15,
      }),
    [term, status, page],
  );
  const columns = useMemo<Column<PopulatedBorrowRecord>[]>(
    () => [
      {
        key: "book",
        header: "Book",
        render: (record) => (
          <div>
            <strong>{record.book.title}</strong>
            <span className="subtext">{record.book.author}</span>
          </div>
        ),
      },
      {
        key: "member",
        header: "Member",
        render: (record) => (
          <div>
            <strong>{record.member.name}</strong>
            <span className="subtext">{record.member.membershipId}</span>
          </div>
        ),
      },
      {
        key: "issued",
        header: "Issued",
        render: (record) => formatDate(record.issueDate),
      },
      {
        key: "due",
        header: "Due",
        render: (record) => formatDate(record.dueDate),
      },
      {
        key: "status",
        header: "Status",
        render: (record) => (
          <Badge
            status={record.effectiveStatus ?? record.status}
            dueDate={record.dueDate}
            returnDate={record.returnDate}
          />
        ),
      },
      {
        key: "history",
        header: "",
        render: (record) => (
          <Link
            className="table-link"
            to={`/members/${record.member._id}/history`}
          >
            Member record
          </Link>
        ),
      },
    ],
    [],
  );
  const clearFilters = () => {
    setSearch("");
    setStatus(null);
  };
  return (
    <section className="page">
      <div className="page-heading">
        <h1>Circulation</h1>
        <p>
          Review every loan across the library, including active, overdue, and
          returned copies.
        </p>
      </div>
      <div className="toolbar">
        <label className="search-field">
          <span>Search circulation</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Book, member, ID, or ISBN"
          />
        </label>
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={setStatus}
          getKey={(option) => option}
          getLabel={(option) =>
            option.charAt(0).toUpperCase() + option.slice(1)
          }
          placeholder="All statuses"
        />
        {(search || status) && (
          <button
            type="button"
            className="button button-quiet clear-filters"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
      {records.error ? (
        <ErrorMessage message={records.error} retry={records.reload} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={records.data?.data ?? []}
            rowKey={(record) => record._id}
            loading={records.loading}
            emptyMessage="No circulation records match these filters. Clear filters to view every loan."
            mobileRender={(record) => (
              <article className="record-card circulation-card">
                <div>
                  <strong>{record.book.title}</strong>
                  <span className="subtext">{record.book.author}</span>
                </div>
                <div className="record-meta">
                  <span>
                    {record.member.name} · {record.member.membershipId}
                  </span>
                  <Badge
                    status={record.effectiveStatus ?? record.status}
                    dueDate={record.dueDate}
                    returnDate={record.returnDate}
                  />
                </div>
                <div className="record-meta">
                  <span>Due {formatDate(record.dueDate)}</span>
                  <Link
                    className="table-link"
                    to={`/members/${record.member._id}/history`}
                  >
                    Member record
                  </Link>
                </div>
              </article>
            )}
          />
          {records.data && (
            <Pagination meta={records.data.meta} onPage={setPage} />
          )}
        </>
      )}
    </section>
  );
}

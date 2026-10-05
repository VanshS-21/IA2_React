import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchMemberHistory, returnBook } from "../api/borrow";
import type { PopulatedBorrowRecord } from "../types/models";
import type { Column } from "../components/common/DataTable";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useAsync } from "../hooks/useAsync";
import { formatDate } from "../utils/date";
import { getErrorMessage } from "../utils/errors";

interface ReturnConfirmation {
  bookTitle: string;
  wasLate: boolean;
}

export function MemberHistoryPage(): JSX.Element {
  const { id = "" } = useParams();
  const history = useAsync(() => fetchMemberHistory(id), [id]);
  const [returning, setReturning] = useState<string | null>(null);
  const [confirmingReturn, setConfirmingReturn] = useState<string | null>(null);
  const [returnConfirmation, setReturnConfirmation] =
    useState<ReturnConfirmation | null>(null);
  const returnLoan = async (record: PopulatedBorrowRecord) => {
    setReturning(record._id);
    try {
      const result = await returnBook(record._id);
      toast.success(
        result.wasLate ? "Return recorded as late." : "Book checked in.",
      );
      setReturnConfirmation({
        bookTitle: record.book.title,
        wasLate: result.wasLate,
      });
      setConfirmingReturn(null);
      history.reload();
    } catch (reason: unknown) {
      toast.error(getErrorMessage(reason));
    } finally {
      setReturning(null);
    }
  };
  const returnAction = (record: PopulatedBorrowRecord) => {
    if (record.returnDate) return null;
    if (confirmingReturn === record._id)
      return (
        <div className="return-confirmation">
          <span>Return this copy?</span>
          <Button
            tone="primary"
            disabled={returning === record._id}
            onClick={() => returnLoan(record)}
          >
            {returning === record._id ? "Returning…" : "Confirm return"}
          </Button>
          <Button
            tone="quiet"
            disabled={returning === record._id}
            onClick={() => setConfirmingReturn(null)}
          >
            Cancel
          </Button>
        </div>
      );
    return (
      <Button tone="secondary" onClick={() => setConfirmingReturn(record._id)}>
        Return copy
      </Button>
    );
  };
  const columns: Column<PopulatedBorrowRecord>[] = [
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
      key: "returned",
      header: "Returned",
      render: (record) => formatDate(record.returnDate),
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
    { key: "action", header: "", render: returnAction },
  ];
  if (history.error)
    return (
      <section className="page narrow-page">
        <ErrorMessage message={history.error} retry={history.reload} />
        <Link className="back-link" to="/members">
          Back to members
        </Link>
      </section>
    );
  const member = history.data?.meta.member;
  return (
    <section className="page">
      {member && (
        <div className="member-card">
          <div>
            <h1>{member.name}</h1>
            <p>
              {member.email} · {member.membershipId}
            </p>
          </div>
          <Link className="back-link" to="/members">
            Back to members
          </Link>
        </div>
      )}
      {returnConfirmation && (
        <section
          className="confirmation-panel return-success"
          aria-live="polite"
        >
          <div>
            <strong>
              {returnConfirmation.wasLate
                ? "Back on the shelf — return recorded late"
                : "Back on the shelf"}
            </strong>
            <p>
              <em>{returnConfirmation.bookTitle}</em> is checked in and
              available for the next reader.
            </p>
          </div>
          <div className="confirmation-actions">
            <Link className="button button-quiet" to="/circulation">
              View circulation
            </Link>
          </div>
        </section>
      )}
      <DataTable
        columns={columns}
        rows={history.data?.data ?? []}
        rowKey={(record) => record._id}
        loading={history.loading}
        emptyMessage="No borrow history yet. Issue a book to start this member’s record."
        mobileRender={(record) => (
          <article className="record-card history-card">
            <div>
              <strong>{record.book.title}</strong>
              <span className="subtext">{record.book.author}</span>
            </div>
            <div className="record-meta">
              <span>Due {formatDate(record.dueDate)}</span>
              <Badge
                status={record.effectiveStatus ?? record.status}
                dueDate={record.dueDate}
                returnDate={record.returnDate}
              />
            </div>
            {returnAction(record)}
          </article>
        )}
      />
    </section>
  );
}

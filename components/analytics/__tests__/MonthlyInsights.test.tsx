import { render, screen } from "@testing-library/react";
import { Expense } from "@/lib/types";
import { MonthlyInsights } from "@/components/analytics/MonthlyInsights";

const NOW = new Date("2026-08-24T12:00:00");

function makeExpense(overrides: Partial<Expense>): Expense {
  return {
    id: crypto.randomUUID(),
    date: "2026-08-01",
    amount: 10,
    category: "Food",
    description: "test",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

// recharts' ResponsiveContainer relies on layout measurements jsdom doesn't
// provide, so it renders nothing in tests; the surrounding markup (labels,
// list, streak box) is what's under test here.
jest.mock("recharts", () => {
  const actual = jest.requireActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

describe("MonthlyInsights", () => {
  it("shows an empty state when there is no spending this month", () => {
    render(<MonthlyInsights expenses={[]} now={NOW} />);

    expect(screen.getByText("Monthly Insights")).toBeInTheDocument();
    expect(
      screen.getByText("No spending recorded this month yet.")
    ).toBeInTheDocument();
  });

  it("shows the top 3 categories by spend for the current month", () => {
    const expenses: Expense[] = [
      makeExpense({ date: "2026-08-02", amount: 420, category: "Food" }),
      makeExpense({ date: "2026-08-03", amount: 180, category: "Transportation" }),
      makeExpense({ date: "2026-08-04", amount: 95, category: "Entertainment" }),
      makeExpense({ date: "2026-08-05", amount: 10, category: "Other" }),
      makeExpense({ date: "2026-07-15", amount: 999, category: "Bills" }),
    ];

    render(<MonthlyInsights expenses={expenses} now={NOW} />);

    expect(screen.getByText(/Food:/)).toBeInTheDocument();
    expect(screen.getByText("$420.00")).toBeInTheDocument();
    expect(screen.getByText(/Transportation:/)).toBeInTheDocument();
    expect(screen.getByText("$180.00")).toBeInTheDocument();
    expect(screen.getByText(/Entertainment:/)).toBeInTheDocument();
    expect(screen.getByText("$95.00")).toBeInTheDocument();

    // 4th-place category and last month's expense are excluded from the
    // top-3 list.
    expect(screen.queryByText(/Other:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bills:/)).not.toBeInTheDocument();
  });

  it("renders the budget streak count", () => {
    render(<MonthlyInsights expenses={[]} now={NOW} />);

    expect(screen.getByText("Budget Streak")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("days!")).toBeInTheDocument();
  });
});

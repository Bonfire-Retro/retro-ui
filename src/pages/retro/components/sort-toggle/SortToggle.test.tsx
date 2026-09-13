import {render, screen} from "@testing-library/react";
import {userEvent} from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";
import {SortToggle} from "./SortToggle.tsx";
import {SortValue} from "./SortValue.ts";

describe("SortToggle", () => {
    it("renders with time active when sortValue is TIME", () => {
        render(<SortToggle sortValue={SortValue.TIME} onToggle={vi.fn()} />);

        const toggle = screen.getByRole("switch");
        expect(toggle).toHaveAttribute("aria-checked", "false");
        expect(toggle).toHaveAccessibleName("Sort by time");
    });

    it("renders with votes active when sortValue is VOTES", () => {
        render(<SortToggle sortValue={SortValue.VOTES} onToggle={vi.fn()} />);

        const toggle = screen.getByRole("switch");
        expect(toggle).toHaveAttribute("aria-checked", "true");
        expect(toggle).toHaveAccessibleName("Sort by votes");
    });

    it("calls onToggle when clicked", async () => {
        const onToggle = vi.fn();
        render(<SortToggle sortValue={SortValue.TIME} onToggle={onToggle} />);

        await userEvent.click(screen.getByRole("switch"));

        expect(onToggle).toHaveBeenCalledOnce();
    });
});

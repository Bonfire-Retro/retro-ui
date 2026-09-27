import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {RetroHeader} from "./RetroHeader.tsx";
import {Retro} from "../../../../services/retro-service/RetroService.ts";
import {SortValue} from "../sort-toggle/SortValue.ts";
import {DateTime} from "luxon";

vi.mock('../share-button/ShareButton.tsx', () => ({
    ShareButton: () => <button>Share</button>
}));

vi.mock('../end-retro-button/EndRetroButton.tsx', () => ({
    EndRetroButton: () => <button>End Retro</button>
}));

vi.mock('../sort-toggle/SortToggle.tsx', () => ({
    SortToggle: () => <button>Sort</button>
}));

vi.mock('../../../../components/category-pill/CategoryPill.tsx', () => ({
    CategoryPill: () => <p>Category</p>
}));

describe('RetroHeader', () => {
    const retro: Retro = {
        id: 'retro-id',
        teamId: 'team-id',
        finished: false,
        thoughts: [],
        createdAt: DateTime.fromISO('2026-01-01T00:00:00Z'),
        template: {
            id: 'template-id',
            name: 'Happy Sad Confused',
            description: 'Reflect on what made the team happy, sad, and confused.',
            categories: []
        }
    };

    const sorting = {sortValue: SortValue.TIME, toggleSort: vi.fn()};

    function renderHeader(isAnonymous = false) {
        render(<MemoryRouter><RetroHeader isAnonymous={isAnonymous} retro={retro} sorting={sorting} /></MemoryRouter>);
    }

    it('should show the retro description when the info button is clicked', () => {
        renderHeader();

        fireEvent.click(screen.getByRole('button', {name: 'Retro description'}));

        expect(screen.getByText(retro.template.description)).toBeInTheDocument();
    });

    it('should show the info button for anonymous participants', () => {
        renderHeader(true);

        expect(screen.getByRole('button', {name: 'Retro description'})).toBeInTheDocument();
    });
});

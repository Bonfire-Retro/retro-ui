import {render, screen} from "@testing-library/react";
import {ColumnHeader} from "./ColumnHeader.tsx";
import {Category} from "../../../../services/retro-service/RetroService.ts";
import {expect} from "vitest";

describe('ColumnHeader', () => {
    const category = {name: 'Something'} as unknown as Category;
    const styling = {backgroundColor: '#00FFFF', textColor: '#00FFFF'};

    it('should display the column name', () => {
        render(<ColumnHeader category={category} styling={styling} />);

        expect(screen.queryByText('Something')).not.toBeNull();
    });

    it('should not display a sort button', () => {
        render(<ColumnHeader category={category} styling={styling} />);

        expect(screen.queryByRole('button')).toBeNull();
    });
});

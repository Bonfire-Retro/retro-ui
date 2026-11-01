import {CountSeparator} from "./CountSeparator.tsx";
import {render, screen} from "@testing-library/react";

describe('Count Separator', () => {
    it('should display the count passed', () => {
        render(<CountSeparator count={10}/>);
        expect(screen.getByText('10')).toBeInTheDocument();
    })

    it('should display only the line when no count is passed', () => {
        const {container} = render(<CountSeparator/>);
        expect(container.textContent).toBe('');
    })

    it('should display a count of zero', () => {
        render(<CountSeparator count={0}/>);
        expect(screen.getByText('0')).toBeInTheDocument();
    })
})

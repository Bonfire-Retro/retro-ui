import {fireEvent, render, screen, within} from "@testing-library/react";
import {RetroDescriptionModal} from "./RetroDescriptionModal.tsx";
import {Template} from "../../../../services/retro-service/RetroService.ts";

describe('RetroDescriptionModal', () => {
    const template: Template = {
        id: 'template-id',
        name: 'Happy Sad Confused',
        description: 'Reflect on what made the team happy, sad, and confused.',
        categories: [
            {
                name: 'Sad',
                description: 'What saddened or angered you?',
                position: 2,
                lightBackgroundColor: '#ffffff',
                lightTextColor: '#000000',
                darkBackgroundColor: '#000000',
                darkTextColor: '#ffffff',
            },
            {
                name: 'Happy',
                description: 'What made you feel happy?',
                position: 1,
                lightBackgroundColor: '#ffffff',
                lightTextColor: '#000000',
                darkBackgroundColor: '#000000',
                darkTextColor: '#ffffff',
            }
        ]
    };

    function openModal(t: Template = template) {
        render(<RetroDescriptionModal template={t} />);
        fireEvent.click(screen.getByRole('button', {name: 'Retro description'}));
    }

    it('should not show the description until the info button is clicked', () => {
        render(<RetroDescriptionModal template={template} />);

        expect(screen.queryByText(template.description)).not.toBeInTheDocument();
    });

    it('should show the template name and description when the info button is clicked', () => {
        openModal();

        expect(screen.getByRole('heading', {name: 'Happy Sad Confused'})).toBeInTheDocument();
        expect(screen.getByText(template.description)).toBeInTheDocument();
    });

    it('should show a description for each column', () => {
        openModal();

        expect(screen.getByText('What made you feel happy?')).toBeInTheDocument();
        expect(screen.getByText('What saddened or angered you?')).toBeInTheDocument();
    });

    it('should show the columns in position order', () => {
        openModal();

        const columns = screen.getAllByRole('listitem');

        expect(within(columns[0]).getByText('Happy')).toBeInTheDocument();
        expect(within(columns[1]).getByText('Sad')).toBeInTheDocument();
    });

    it('should color each column header with the category colors', () => {
        openModal();

        expect(screen.getByRole('heading', {name: 'Happy'})).toHaveStyle({backgroundColor: '#ffffff', color: '#000000'});
    });

    it('should close when the close button is clicked', () => {
        openModal();

        fireEvent.click(screen.getByRole('button', {name: 'Close modal'}));

        expect(screen.queryByText(template.description)).not.toBeInTheDocument();
    });

    it('should close when the backdrop is clicked', () => {
        openModal();

        fireEvent.click(screen.getByRole('dialog'));

        expect(screen.queryByText(template.description)).not.toBeInTheDocument();
    });

    it('should stay open when the dialog content is clicked', () => {
        openModal();

        fireEvent.click(screen.getByText(template.description));

        expect(screen.getByText(template.description)).toBeInTheDocument();
    });

    it('should reset when the dialog is dismissed by the browser', () => {
        openModal();

        fireEvent(screen.getByRole('dialog'), new Event('close'));

        expect(screen.queryByText(template.description)).not.toBeInTheDocument();
    });

    it('should not show a description paragraph when the template has no description', () => {
        openModal({...template, description: ''});

        expect(screen.getByRole('heading', {name: 'Happy Sad Confused'})).toBeInTheDocument();
        expect(screen.queryByTestId('retro-description')).not.toBeInTheDocument();
    });
});

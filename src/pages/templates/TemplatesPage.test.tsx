import { render, screen, within } from '@testing-library/react';
import { TemplatesPage } from './TemplatesPage';
import { useLoaderData } from 'react-router-dom';
import { TemplatesPageData } from './templatesLoader';
import { Template } from '../../services/retro-service/RetroService.ts';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', () => ({
  useLoaderData: vi.fn(),
}));

vi.mock('../../context/hooks.tsx', () => ({
  useTheme: () => ({
    theme: 'light'
  }),
  useCategoryStyling: () => ({ backgroundColor: '#ffffff', textColor: '#000000' }),
  Theme: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  }
}));

const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('TemplatesPage', () => {
  const mockTemplates: Template[] = [
    {
      id: 'template-1',
      name: 'Start Stop Continue',
      description: 'Classic retrospective format focusing on what to start, stop, and continue doing.',
      categories: [
        {
          name: 'Start',
          description: 'Start description',
          position: 0,
          lightBackgroundColor: '#e8f5e8',
          lightTextColor: '#2d5a2d',
          darkBackgroundColor: '#1a3d1a',
          darkTextColor: '#90ee90'
        },
        {
          name: 'Stop',
          description: 'Stop description',
          position: 1,
          lightBackgroundColor: '#ffe8e8',
          lightTextColor: '#5a2d2d',
          darkBackgroundColor: '#3d1a1a',
          darkTextColor: '#ff9090'
        },
        {
          name: 'Continue',
          description: 'Continue description',
          position: 2,
          lightBackgroundColor: '#e8e8ff',
          lightTextColor: '#2d2d5a',
          darkBackgroundColor: '#1a1a3d',
          darkTextColor: '#9090ff'
        }
      ]
    },
    {
      id: 'template-2',
      name: 'Mad Sad Glad',
      description: 'Emotional retrospective format to express feelings about the sprint.',
      categories: [
        {
          name: 'Mad',
          description: 'Mad description',
          position: 0,
          lightBackgroundColor: '#ffe8e8',
          lightTextColor: '#5a2d2d',
          darkBackgroundColor: '#3d1a1a',
          darkTextColor: '#ff9090'
        },
        {
          name: 'Sad',
          description: 'Sad description',
          position: 1,
          lightBackgroundColor: '#fff8e8',
          lightTextColor: '#5a4d2d',
          darkBackgroundColor: '#3d2f1a',
          darkTextColor: '#ffcc90'
        },
        {
          name: 'Glad',
          description: 'Glad description',
          position: 2,
          lightBackgroundColor: '#e8f5e8',
          lightTextColor: '#2d5a2d',
          darkBackgroundColor: '#1a3d1a',
          darkTextColor: '#90ee90'
        }
      ]
    },
    {
      id: 'template-3',
      name: 'What Went Well',
      description: 'Simple format focusing on positive outcomes and improvements.',
      categories: [
        {
          name: 'What went well',
          description: 'What went well description',
          position: 0,
          lightBackgroundColor: '#e8f5e8',
          lightTextColor: '#2d5a2d',
          darkBackgroundColor: '#1a3d1a',
          darkTextColor: '#90ee90'
        },
        {
          name: 'What could be improved',
          description: 'What could be improved description',
          position: 1,
          lightBackgroundColor: '#fff8e8',
          lightTextColor: '#5a4d2d',
          darkBackgroundColor: '#3d2f1a',
          darkTextColor: '#ffcc90'
        }
      ]
    }
  ];

  const mockTemplatesPageData: TemplatesPageData = {
    templates: mockTemplates
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoaderData as ReturnType<typeof vi.fn>).mockReturnValue(mockTemplatesPageData as TemplatesPageData);
  });

  describe('Rendering', () => {
    it('should render the page title', () => {
      render(<TemplatesPage />);
      expect(screen.getByText('Retro Templates')).toBeInTheDocument();
    });

    it('should render all template names as headings', () => {
      render(<TemplatesPage />);
      
      expect(screen.getByRole('heading', { name: 'Start Stop Continue' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Mad Sad Glad' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'What Went Well' })).toBeInTheDocument();
    });

    it('should render all template descriptions', () => {
      render(<TemplatesPage />);
      
      expect(screen.getByText('Classic retrospective format focusing on what to start, stop, and continue doing.')).toBeInTheDocument();
      expect(screen.getByText('Emotional retrospective format to express feelings about the sprint.')).toBeInTheDocument();
      expect(screen.getByText('Simple format focusing on positive outcomes and improvements.')).toBeInTheDocument();
    });

    it('should render category names for all templates', () => {
      render(<TemplatesPage />);
      
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Stop')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
      
      expect(screen.getByText('Mad')).toBeInTheDocument();
      expect(screen.getByText('Sad')).toBeInTheDocument();
      expect(screen.getByText('Glad')).toBeInTheDocument();
      
      expect(screen.getByText('What went well')).toBeInTheDocument();
      expect(screen.getByText('What could be improved')).toBeInTheDocument();
    });

    it('should render a description for each category', () => {
      render(<TemplatesPage />);

      expect(screen.getByText('Start description')).toBeInTheDocument();
      expect(screen.getByText('Mad description')).toBeInTheDocument();
      expect(screen.getByText('What could be improved description')).toBeInTheDocument();
    });

    it('should render category headers in position order', () => {
      const reversed = { ...mockTemplates[0], categories: [...mockTemplates[0].categories].reverse() };
      (useLoaderData as ReturnType<typeof vi.fn>).mockReturnValue({ templates: [reversed] });

      render(<TemplatesPage />);

      const columns = screen.getAllByRole('listitem');
      expect(within(columns[0]).getByRole('heading', { name: 'Start' })).toBeInTheDocument();
      expect(within(columns[2]).getByRole('heading', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should not render a description paragraph when a template has no description', () => {
      (useLoaderData as ReturnType<typeof vi.fn>).mockReturnValue({ templates: [{ ...mockTemplates[0], description: '' }] });

      render(<TemplatesPage />);

      expect(screen.queryByTestId('retro-description')).not.toBeInTheDocument();
    });

    it('should set template id as heading id attribute', () => {
      render(<TemplatesPage />);
      
      const startStopContinueHeading = screen.getByRole('heading', { name: 'Start Stop Continue' });
      const madSadGladHeading = screen.getByRole('heading', { name: 'Mad Sad Glad' });
      const whatWentWellHeading = screen.getByRole('heading', { name: 'What Went Well' });
      
      expect(startStopContinueHeading).toHaveAttribute('id', 'template-1');
      expect(madSadGladHeading).toHaveAttribute('id', 'template-2');
      expect(whatWentWellHeading).toHaveAttribute('id', 'template-3');
    });
  });
});

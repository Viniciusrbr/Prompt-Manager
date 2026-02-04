import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/sidebar/sidebar-content';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const initialPrompts = [
  {
    id: '1',
    title: 'Prompt 1',
    content: 'Content 1',
  },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe('SidebarContent', () => {
  const user = userEvent.setup();

  describe('base', () => {
    it('should render a new prompt button', () => {
      makeSut();

      expect(screen.getByRole('complementary')).toBeVisible(); // aside element

      expect(
        screen.getByRole('button', { name: 'Novo prompt' })
      ).toBeInTheDocument();
    });

    it('should render the prompt list', () => {
      const input = [
        { id: '1', title: 'Example 1', content: 'Content 1' },
        { id: '2', title: 'Example 2', content: 'Content 2' },
        { id: '3', title: 'Example 3', content: 'Content 3' },
      ];

      makeSut({ prompts: input });

      expect(screen.getByText(input[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(input.length);
    });

    it('should update the search input value when typing', async () => {
      const text = 'AI';
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('collapse / expand', () => {
    it('should start expanded and display the minimize button', () => {
      makeSut();

      const aside = screen.getByRole('complementary');
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });
      expect(expandButton).not.toBeInTheDocument();
    });

    it('It should contract and show the expand button.', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });

      expect(expandButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe('new prompt navigation', () => {
    it('should navigate to /new when clicking the new prompt button', async () => {
      makeSut();

      const newButton = screen.getByRole('button', { name: 'Novo prompt' });

      await user.click(newButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });
});

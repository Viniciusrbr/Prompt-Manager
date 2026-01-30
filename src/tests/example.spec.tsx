import { render, screen } from '@/lib/test-utils';

describe('Example Test Suite', () => {
  it('should pass this example test', () => {
    render(<div>Hello, World! </div>);

    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});

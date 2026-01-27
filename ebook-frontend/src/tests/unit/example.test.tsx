import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App Test Setup', () => {
    it('should pass true', () => {
        expect(true).toBe(true);
    });

    it('should render a simple div', () => {
        render(<div data-testid="test-div">Hello Test</div>);
        expect(screen.getByTestId('test-div')).toHaveTextContent('Hello Test');
    });
});

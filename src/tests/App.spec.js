import React from 'react';
import App from '../App';
import { render, screen, waitFor, act } from '@testing-library/react';
import { createClient } from '@supabase/supabase-js';
import userEvent from '@testing-library/user-event';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [
        { id: 1, title: 'Test Record', time: 60 },
      ], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
      delete: jest.fn(() => {
        return { eq: jest.fn(() => Promise.resolve({ data: [], error: null })) };
      }),
    })),
  })),
}));

describe('Test App Compornent', () => {
  beforeEach(() => {
    // Supabaseクライアントのモックを設定
    createClient.mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Test Record', time: 60 }],
        error: null,
      }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
  });
  
  it('should render title', async() => {
    await act(async () => {
      render(<App />);
    });
    const titleTag = screen.getByTestId('title');
    expect(titleTag).toHaveTextContent('学習記録一覧');
  });

  it('should add a new record when form is submitted', async() => {
    await act(async () => {
      render(<App />);
    });
    const titleInput = screen.getByTestId('title-input');
    const timeInput = screen.getByTestId('time-input');
    await userEvent.type(titleInput, 'New Record');
    await userEvent.type(timeInput, '30');
    await userEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByText('New Record: 30時間')).toBeInTheDocument();
    });
  });

  it('should delete a record when delete button is clicked', async() => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Test Record: 60時間')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('delete-button'));

    await waitFor(() => {
      expect(screen.queryByText('Test Record: 60時間')).not.toBeInTheDocument();
    });
  });

  it('should show error message when title is empty', async() => {
    await act(async () => {
      render(<App />);
    });
    await userEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByText('入力されていない項目があります')).toBeInTheDocument();
    });
  });
});
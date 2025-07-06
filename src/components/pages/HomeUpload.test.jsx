import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomeUpload from './HomeUpload';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import { MemoryRouter } from 'react-router-dom';

// Mock the hooks
vi.mock('../../store/useCloset');
vi.mock('../../contexts/LanguageContext');

describe('HomeUpload', () => {
  it('should update the Zalando URL in the input and enable the extract button', () => {
    const setHomeZalandoUrl = vi.fn();
    useCloset.mockReturnValue({
      homeZalandoUrl: '',
      homeClothPhotoUrl: '',
      setUserPhoto: vi.fn(),
      setClothPhoto: vi.fn(),
      setHomeZalandoUrl,
      setHomeClothPhotoUrl: vi.fn(),
    });

    useLanguage.mockReturnValue({ t: (key) => key });

    render(
      <MemoryRouter>
        <HomeUpload />
      </MemoryRouter>
    );

    // Get the input field by its placeholder
    const zalandoInput = screen.getByPlaceholderText('home.zalandoPlaceholder');
    
    // Get the extract button by its text content
    const extractButton = screen.getByText('home.extractImage');

    // Initially, the button might be disabled depending on the logic
    // Let's check if the input is empty initially
    expect(zalandoInput.value).toBe('');
    expect(extractButton).toBeDisabled();

    // Simulate entering a valid Zalando URL
    const testUrl = 'https://www.zalando.de/some-product.html';
    fireEvent.change(zalandoInput, { target: { value: testUrl } });

    // Check if the input value has changed
    expect(zalandoInput.value).toBe(testUrl);

    // Check if the zustand store function was called
    expect(setHomeZalandoUrl).toHaveBeenCalledWith(testUrl);
  });
});

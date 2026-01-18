# GlobalTix Components

This folder contains reusable components specific to the GlobalTix feature.

## Components

### FilterButton
A button component that displays in the header and shows the current filter status. It includes:
- Visual indication when filters are active
- Badge showing number of active filters
- Proper theming support (light/dark mode)

**Props:**
- `onPress`: Function called when button is pressed
- `activeFiltersCount`: Number of currently active filters

### GlobalTixFilters
A modal component that provides filtering options for GlobalTix attractions. It includes:
- Country selection (single choice)
- Category selection (multiple choice)
- City selection (multiple choice)
- Apply and clear functionality

**Props:**
- `onClose`: Function called when modal should close
- `onApply`: Function called when filters are applied

## Usage

```jsx
import { FilterButton, GlobalTixFilters } from './components';

// Use FilterButton in header
<FilterButton 
  onPress={() => setShowFilters(true)}
  activeFiltersCount={getActiveFiltersCount()}
/>

// Use GlobalTixFilters as modal
<GlobalTixFilters
  onClose={() => setShowFilters(false)}
  onApply={handleFiltersApply}
/>
```

## File Structure

```
components/
├── index.js          # Component exports
├── FilterButton.jsx  # Filter button component
├── GlobalTixFilters.jsx # Filter modal component
└── README.md         # This documentation
```



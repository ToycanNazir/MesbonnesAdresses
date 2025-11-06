import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from './Button';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    onPress: action('button-press'),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    title: 'Delete',
    variant: 'danger',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    title: 'This is a very long button text to test wrapping',
    variant: 'primary',
  },
};

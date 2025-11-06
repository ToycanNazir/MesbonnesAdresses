import type { Meta, StoryObj } from '@storybook/react-native';
import { AddressCard } from './AddressCard';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Components/AddressCard',
  component: AddressCard,
  argTypes: {
    isPublic: {
      control: { type: 'boolean' },
    },
  },
  args: {
    onPress: action('card-press'),
  },
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
} satisfies Meta<typeof AddressCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PublicWithImage: Story = {
  args: {
    name: 'Restaurant Le Gourmet',
    description: 'Excellent restaurant français avec une vue magnifique sur la Seine.',
    photoURL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    isPublic: true,
  },
};

export const PrivateWithImage: Story = {
  args: {
    name: 'Mon Café Secret',
    description: 'Un petit café cosy que j\'adore pour travailler au calme.',
    photoURL: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    isPublic: false,
  },
};

export const WithoutImage: Story = {
  args: {
    name: 'Parc de la Ville',
    description: 'Un beau parc pour se promener et se détendre.',
    isPublic: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    name: 'Supermarché Bio',
    photoURL: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    isPublic: false,
  },
};

export const LongName: Story = {
  args: {
    name: 'Restaurant Très Très Très Long Nom Qui Devrait Être Tronqué',
    description: 'Description normale',
    isPublic: true,
  },
};

export const LongDescription: Story = {
  args: {
    name: 'Librairie Centrale',
    description: 'Une magnifique librairie avec des milliers de livres dans tous les genres. On y trouve aussi un coin café très sympa et des événements culturels réguliers. Le personnel est très accueillant et de bon conseil.',
    photoURL: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    isPublic: true,
  },
};

export const Minimal: Story = {
  args: {
    name: 'Simple Address',
    isPublic: false,
  },
};

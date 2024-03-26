import type { Meta, StoryObj } from '@storybook/svelte';
import PianoRoll from './PianoRoll.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'PianoRoll',
  component: PianoRoll,
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<PianoRoll>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
  },
};
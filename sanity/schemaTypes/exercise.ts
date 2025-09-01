import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'exercise',
  title: 'Exercise',
  type: 'document',
  description: 'A physical exercise that can be performed during workouts',
  fields: [
    defineField({
      name: 'name',
      title: 'Exercise Name',
      type: 'string',
      description: 'The name of the exercise (e.g., Push-ups, Squats, Deadlifts)',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description of how to perform the exercise, including proper form and technique',
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      description: 'The skill level required to perform this exercise safely and effectively',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Exercise Image',
      type: 'image',
      description: 'Visual reference showing the exercise being performed or equipment needed',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility. Describe what the image shows.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Link to a video demonstration of the exercise (YouTube, Vimeo, etc.)',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'isActive',
      title: 'Active Status',
      type: 'boolean',
      description: 'Whether this exercise is currently available for use in workouts',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      difficulty: 'difficulty',
      media: 'image',
    },
    prepare(selection) {
      const {title, difficulty, media} = selection
      return {
        title: title,
        subtitle: `Difficulty: ${difficulty}`,
        media: media,
      }
    },
  },
})

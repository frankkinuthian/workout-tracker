import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  description: 'A workout session performed by a user with specific exercises, sets, and weights',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'The Clerk ID of the user who performed this workout',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      type: 'datetime',
      description: 'When this workout was performed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total duration of the workout in seconds',
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      description: 'List of exercises performed during this workout',
      of: [
        {
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{type: 'exercise'}],
              description: 'Reference to the exercise being performed',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              type: 'array',
              description: 'Sets performed for this exercise',
              of: [
                {
                  type: 'object',
                  name: 'exerciseSet',
                  title: 'Exercise Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      type: 'number',
                      description: 'Number of repetitions performed',
                      validation: (Rule) => Rule.required().positive().integer(),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      description: 'Weight used for this set',
                      validation: (Rule) => Rule.required().positive(),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      description: 'Unit of measurement for the weight',
                      options: {
                        list: [
                          {title: 'Pounds (lbs)', value: 'lbs'},
                          {title: 'Kilograms (kg)', value: 'kg'},
                        ],
                        layout: 'radio',
                      },
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      unit: 'weightUnit',
                    },
                    prepare(selection) {
                      const {reps, weight, unit} = selection
                      return {
                        title: `${reps} reps @ ${weight} ${unit}`,
                      }
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              exerciseName: 'exercise.name',
              setsCount: 'sets',
            },
            prepare(selection) {
              const {exerciseName, setsCount} = selection
              return {
                title: exerciseName || 'Exercise',
                subtitle: `${setsCount?.length || 0} sets`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      userId: 'userId',
      date: 'date',
      exerciseCount: 'exercises',
    },
    prepare(selection) {
      const {userId, date, exerciseCount} = selection
      const workoutDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const exerciseCountText = exerciseCount ? `${exerciseCount.length} exercises` : 'No exercises'
      
      return {
        title: `Workout by ${userId}`,
        subtitle: `${workoutDate} - ${exerciseCountText}`,
      }
    },
  },
})

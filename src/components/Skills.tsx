import React from 'react'

import { Skill } from '~/types'

type Props = {
  skills: Skill[]
  classNames?: string
}

const Skills: React.FC<Props> = ({ skills, classNames }) => (
  <section id="skills" className={classNames}>
    <h2 className="text-4xl">Skills</h2>
    <div className="text-xl my-2">技術</div>
    <ul className="lg:pr-20 m-5">
      {skills.map((skill) => (
        <li className="my-3 inline-block" key={skill.name}>
          <span className="self-center">{skill.name}</span>
          <span className="mx-2">/</span>
          {/* <div className="bg-gray-200 h-2.5 rounded-full flex-1 self-center">
              <div
                className="bg-gray-600 h-2.5 rounded-l-full flex-1"
                style={{ width: `${skill.value}%` }}
              />
            </div>
            <div className="text-sm self-center ml-3">{100}</div> */}
        </li>
      ))}
    </ul>
  </section>
)

export default Skills

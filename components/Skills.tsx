import React from 'react'

import { Skill } from '../types'

type Props = {
  skills: Skill[]
}

const Skills: React.VFC<Props> = ({ skills }) => (
  <section className="mx-2 my-16">
    <h2 className="text-4xl">Skills</h2>
    <div className="text-xl my-2">技術</div>
    <ul className="m-5">
      {skills.map((skill) => (
        <li className="grid grid-cols-3 my-3" key={skill.name}>
          <div className="col-span-1 self-center">{skill.name}</div>
          <div className="col-span-2 h-6 flex">
            <div className="text-sm self-center mr-3">{0}</div>
            <div className="bg-gray-200 h-2.5 rounded-full flex-1 self-center">
              <div
                className="bg-gray-600 h-2.5 rounded-l-full flex-1"
                style={{ width: `${skill.value}%` }}
              />
            </div>
            <div className="text-sm self-center ml-3">{100}</div>
          </div>
        </li>
      ))}
    </ul>
  </section>
)

export default Skills

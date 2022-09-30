import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import fetch from 'shared/fetch'
import type { IUser } from 'shared/models/user';

const User: React.FC = () => {
  const { id } = useParams()
  const { data } = useQuery(['users'], () => fetch<IUser>(`user/${id}`), { suspense: true })

  return <div className="is-flex is-flex-direction-column is-align-items-center">
    <div>
      {data?.avatar ?
        <img src={data!.avatar} alt={`${data!.username}'s profile picture`} />
        : 'TODO add'
      }
    </div>
    <h2 className="is-size-4">{data!.firstName} {data!.lastName}</h2>
  </div>
}

export default User

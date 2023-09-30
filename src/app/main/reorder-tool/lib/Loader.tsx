'use client'
import React from 'react'
import { Puff } from 'react-loader-spinner'

type Props = {}

const LoaderToast = (props: Props) => {
  return (
    <div className="flex items-center justify-around text-slate-950 font-semibold">
          <Puff
            height="50"
            width="50"
            radius={1}
            color="#4fa94d"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          Progressing ........
        </div>
  )
}

export default LoaderToast
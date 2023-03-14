import AttachImages from '@/components/AttachImages'
import ImageScroller from '@/components/ImageScroller'
import { useAuth } from '@/context/AuthContext'
import s from '@/styles/Create.module.css'
import { createPoll } from '@/utils/helper'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BiImageAdd } from 'react-icons/bi'
import { MdOutlineRemoveCircleOutline } from 'react-icons/md'
import { RiImageAddFill } from 'react-icons/ri'

export default function Create() {
  // Local States
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [privacy, setPrivacy] = useState('public')
  const [isCreating, setIsCreating] = useState(false)
  const [attachments, setAttachments] = useState([])

  // Router
  const router = useRouter()

  // getting user
  const { user } = useAuth()

  // Custome Functions
  const addOption = () => {
    setOptions((prev) => [...prev, ''])
  }

  // Change Options Input
  const handleChangeOption = (e, i) => {
    const list = [...options]
    list[i] = e.target.value
    setOptions(list)
  }

  // Remove Image
  const removeImage = (i) => {
    const list = [...attachments]
    list.splice(i, 1)
    setAttachments(list)
  }

  // Remove Options
  const handleRemove = (i) => {
    const list = [...options]
    list.splice(i, 1)
    setOptions(list)
  }

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim().length) {
      toast.error(<b>Enter a valid poll question!</b>)
      return
    }

    if (options.length > 0) {
      const duplicate = options.map((item) => item.trim())

      const check = duplicate.filter((currentValue, currentIndex) =>
        options.indexOf(currentValue) !== currentIndex)

      if (check.length) {
        toast.error(<b>Options must be unique!</b>)
        return
      }
    }
    setIsCreating(true)
    const id = toast.loading(<b>Creating Poll Please Wait</b>)
    try {
      // if(attachments?.length){

      // }
      const pollid = await createPoll(
        question.trim(),
        options,
        privacy,
        user,
        attachments
      )
      if (pollid) {
        setIsCreating(false)
        toast.success(<b>Created Successfully</b>, { id })
        router.push('/poll/' + pollid)
      } else {
        throw new Error('Something went wrong Try Again!')
      }
    } catch (error) {
      console.log(error)
      toast.error(<b>{error.message}</b>, { id })
      setIsCreating(false)
    }
  }

  return (
    <>
      <Head>
        <title>CREATE | PollDoh</title>
      </Head>
      <div className={`wrapper ${s.createBody}`}>
        <h2 className="header">Create Poll </h2>
        <form onSubmit={handleSubmit}>
          <div className={s.formDiv}>
            <label>Type Your Question</label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Eg: What is best React or NextJs"
            />
          </div>
          {attachments.length > 0 ? (
            <ImageScroller
              images={attachments}
              removeImage={removeImage}
              edit={true}
            />
          ) : null}

          <AttachImages
            attachments={attachments}
            setAttachments={setAttachments}
          />
          <div className={s.optionsWrapper}>
            {options.map((option, i) => (
              <div key={i} className={s.formDiv}>
                <div className={s.labelDiv}>
                  <label>Option {i + 1}</label>
                  {i > 1 ? (
                    <MdOutlineRemoveCircleOutline
                      onClick={() => handleRemove(i)}
                    />
                  ) : null}
                </div>
                <input
                  onChange={(e) => handleChangeOption(e, i)}
                  type="text"
                  required
                  maxLength={40}
                  value={option}
                  placeholder={`Eg: Option ${i + 1}`}
                />
              </div>
            ))}
          </div>
          <button
            disabled={options.length > 4}
            className={s.addBtn}
            onClick={addOption}
            type="button"
          >
            Add More
          </button>
          <div className={s.formDiv}>
            <label>Privacy</label>
            <select
              onChange={(e) => setPrivacy(e.target.value)}
              value={privacy}
            >
              <option value="public">Public (Listed)</option>
              <option value="private">Private (Unlisted)</option>
              <option value="anonymous">Anonymous (Listed)</option>
            </select>
          </div>
          <button disabled={isCreating} className={s.createBtn} type="submit">
            {isCreating ? 'Creating Wait' : 'Create Poll'}
          </button>
        </form>
      </div>
    </>
  )
}

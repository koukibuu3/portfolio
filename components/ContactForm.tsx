import React from 'react'

const ContactForm: React.VFC = () => {
  return (
    <section id="contacts" className="m-2 pt-20">
      <h2 className="text-4xl">Contacts</h2>
      <div className="text-xl my-2">お問い合わせ</div>
      <form
        method="post"
        action="https://hyperform.jp/api/4Xn7BB8d"
        className="lg:mx-5"
      >
        <label htmlFor="メールアドレス" className="block mt-4">
          <span className="text-gray-700">メールアドレス</span>
          <input
            type="email"
            name="メールアドレス"
            className="mt-1 p-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            required
          />
        </label>
        <label htmlFor="お問い合わせ内容" className="block mt-4">
          <span className="text-gray-700">お問い合わせ内容</span>
          <textarea
            name="お問い合わせ内容"
            className="mt-1 p-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            rows={4}
            required
          />
        </label>
        <span className="mt-1 block w-full">
          <button
            type="submit"
            className="mx-auto p-2 block hover:text-orange-700"
          >
            送信
          </button>
        </span>
      </form>
    </section>
  )
}

export default ContactForm

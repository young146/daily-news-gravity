'use client';

import { useFormStatus } from 'react-dom';
import { createDraftAndRedirectAction } from './actions';

function SubmitButton({ status, translationStatus }) {
    const { pending } = useFormStatus();

    let label = '✨ 개별 번역';
    let colorClass = 'bg-blue-600 hover:bg-blue-700 text-white';

    if (translationStatus === 'DRAFT' || translationStatus === 'COMPLETED') {
        label = '📝 검토/수정';
        colorClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300';
    } else if (status === 'PUBLISHED') {
        label = 'Published ✅';
        colorClass = 'bg-green-100 text-green-800 border border-green-200';
    }

    return (
        <button
            type="submit"
            disabled={pending}
            className={`text-xs px-3 py-1.5 rounded transition flex items-center gap-1 ${pending ? 'bg-gray-400 cursor-not-allowed text-white' : colorClass}`}
        >
            {pending ? '처리중...' : label}
        </button>
    );
}

export default function GenerateButton({ id, status, translationStatus }) {
    return (
        <form action={createDraftAndRedirectAction}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton status={status} translationStatus={translationStatus} />
        </form>
    );
}

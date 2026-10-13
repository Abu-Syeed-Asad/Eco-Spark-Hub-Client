"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CornerDownRight, LoaderCircle, MessageCircle, MoreHorizontal, Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/providers/CurrentUserProvider";
import { createComment, deleteComment, editComment, getComments } from "@/service/comment/comment.actions";
import type { CommentAuthor, CommentItem } from "@/types/comment";
import { AppLoader } from "@/components/ui/app-loader";

function PersonAvatar({ person, small = false }: { person: Pick<CommentAuthor, "name" | "image">; small?: boolean }) {
  return <Avatar className={small ? "size-8" : "size-9"}>
    {person.image && <AvatarImage src={person.image} alt={person.name} />}
    <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">{person.name.trim().slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
  </Avatar>;
}

function Composer({ onSubmit, name, image, placeholder = "Write a comment...", initialValue = "", onCancel, autoFocus = false, showAvatar = true }: {
  onSubmit: (content: string) => Promise<void>; name: string; image: string | null;
  placeholder?: string; initialValue?: string; onCancel?: () => void; autoFocus?: boolean; showAvatar?: boolean;
}) {
  const [text, setText] = useState(initialValue);
  const [pending, setPending] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!text.trim() || pending) return;
    setPending(true);
    try { await onSubmit(text.trim()); setText(""); }
    catch { /* The shared mutation displays the error; preserve the draft for retry. */ }
    finally { setPending(false); }
  };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault(); void submit();
    }
    if (event.key === "Escape" && onCancel) onCancel();
  };
  return <form onSubmit={event => void submit(event)} className="flex items-start gap-2.5">
    {showAvatar && <PersonAvatar person={{ name, image }} />}
    <div className="min-w-0 flex-1">
      <div className="flex items-end gap-2 rounded-2xl border border-transparent bg-slate-100 px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 dark:bg-slate-800">
        <textarea ref={input} autoFocus={autoFocus} aria-label={placeholder} placeholder={placeholder} value={text} maxLength={2000} rows={2} disabled={pending} onChange={event => setText(event.target.value)} onKeyDown={keyDown} className="min-h-10 w-full resize-y bg-transparent py-1 text-sm leading-5 outline-none placeholder:text-slate-500 disabled:opacity-60" />
        <button type="submit" disabled={!text.trim() || pending} aria-label={onCancel && initialValue ? "Save comment" : "Post comment"} className="mb-1 grid size-8 shrink-0 place-items-center rounded-full text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 dark:text-emerald-400 dark:hover:bg-emerald-950">
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
        </button>
      </div>
      <div className="mt-1 flex justify-between gap-2 px-1 text-[11px] text-slate-500 dark:text-slate-400">
        <span>Enter to {initialValue ? "save" : "post"} ? Shift + Enter for a new line</span>
        {onCancel ? <button type="button" onClick={onCancel} disabled={pending} className="font-semibold hover:underline">Cancel</button> : <span>{text.length}/2000</span>}
      </div>
    </div>
  </form>;
}

type Change = { kind: "create"; content: string; parentId?: string } | { kind: "edit"; id: string; content: string } | { kind: "delete"; id: string };

function CommentBubble({ comment, onChange, onReply, pending, small = false }: {
  comment: CommentItem; onChange: (change: Change) => Promise<void>; onReply: (comment: CommentItem) => void; pending: boolean; small?: boolean;
}) {
  const user = useCurrentUser();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const own = user?.id === comment.userId;
  const canDelete = own || user?.role === "ADMIN";
  const createdAt = new Date(comment.createdAt);
  return <div className="flex items-start gap-2.5">
    <PersonAvatar person={comment.user} small={small} />
    <div className="min-w-0 flex-1">
      {editing && user ? <Composer name={user.name} image={user.image} showAvatar={false} autoFocus initialValue={comment.content} placeholder="Edit your comment..." onCancel={() => setEditing(false)} onSubmit={async content => { await onChange({ kind: "edit", id: comment.id, content }); setEditing(false); }} /> : <>
        <div className="flex items-start gap-1">
          <div className="min-w-0 rounded-2xl bg-slate-100 px-3.5 py-2.5 dark:bg-slate-800">
            <p className="break-words text-[13px] font-semibold text-slate-900 dark:text-slate-100">{comment.user.name}</p>
            <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-5 text-slate-700 dark:text-slate-200">{comment.content}</p>
          </div>
          {canDelete && <DropdownMenu>
            <DropdownMenuTrigger aria-label={`Actions for ${comment.user.name}'s comment`} disabled={pending} className="mt-1 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {own && <DropdownMenuItem onClick={() => setEditing(true)}><Pencil className="size-4" />Edit</DropdownMenuItem>}
              <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
        <div className="mt-1 flex items-center gap-3 px-3 text-xs text-slate-500 dark:text-slate-400">
          <time dateTime={comment.createdAt} title={createdAt.toLocaleString()}>{Number.isNaN(createdAt.getTime()) ? "" : formatDistanceToNow(createdAt, { addSuffix: true })}</time>
          {user && <button type="button" disabled={pending} onClick={() => onReply(comment)} className="font-semibold hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">Reply</button>}
        </div>
      </>}
      {confirmDelete && <div role="alert" className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs dark:border-red-900 dark:bg-red-950/30">
        <p>Delete this comment{comment.replies?.length ? " and its replies" : ""}?</p>
        <div className="mt-2 flex gap-3">
          <button type="button" disabled={pending} onClick={() => void onChange({ kind: "delete", id: comment.id }).catch(() => {})} className="font-semibold text-red-700 disabled:opacity-50 dark:text-red-400">{pending ? "Deleting..." : "Delete"}</button>
          <button type="button" disabled={pending} onClick={() => setConfirmDelete(false)} className="font-semibold">Cancel</button>
        </div>
      </div>}
    </div>
  </div>;
}

function CommentThread({ comment, onChange, pending }: { comment: CommentItem; onChange: (change: Change) => Promise<void>; pending: boolean }) {
  const user = useCurrentUser();
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyLimit, setReplyLimit] = useState(3);
  const replies = comment.replies ?? [];
  return <li className="space-y-2">
    <CommentBubble comment={comment} onChange={onChange} pending={pending} onReply={setReplyTo} />
    {replies.length > 0 && <button type="button" onClick={() => setShowReplies(!showReplies)} aria-expanded={showReplies} className="ml-12 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"><CornerDownRight className="size-4" />{showReplies ? "Hide replies" : `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}</button>}
    {showReplies && <div className="ml-5 space-y-3 border-l-2 border-slate-200 pl-5 sm:ml-8 dark:border-slate-700">
      {replies.slice(0, replyLimit).map(reply => <CommentBubble key={reply.id} comment={reply} onChange={onChange} onReply={setReplyTo} pending={pending} small />)}
      {replyLimit < replies.length && <button type="button" onClick={() => setReplyLimit(replyLimit + 5)} className="ml-10 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">View more replies ({replies.length - replyLimit})</button>}
    </div>}
    {replyTo && user && <div className="ml-5 space-y-2 border-l-2 border-emerald-200 pl-5 sm:ml-8 dark:border-emerald-900">
      <p className="text-xs text-slate-500">Replying to <span className="font-semibold">{replyTo.user.name}</span></p>
      <Composer key={replyTo.id} name={user.name} image={user.image} autoFocus placeholder={`Reply to ${replyTo.user.name}...`} onCancel={() => setReplyTo(null)} onSubmit={async content => {
        await onChange({ kind: "create", content, parentId: replyTo.id });
        setReplyTo(null); setShowReplies(true); setReplyLimit(replies.length + 1);
      }} />
    </div>}
  </li>;
}

export default function CommentSection({ postId, initialCount = 0, defaultOpen = false }: { postId: string; initialCount?: number; defaultOpen?: boolean }) {
  const user = useCurrentUser();
  const pathname = usePathname();
  const [open, setOpen] = useState(defaultOpen);
  const client = useQueryClient();
  const queryKey = ["comments", postId];
  const query = useInfiniteQuery({
    queryKey, initialPageParam: 1, queryFn: ({ pageParam }) => getComments(postId, pageParam),
    getNextPageParam: last => last.page < last.totalPages ? last.page + 1 : undefined,
    enabled: open, staleTime: 10000, refetchOnWindowFocus: true, retry: 1,
  });
  const mutation = useMutation({
    mutationFn: async (change: Change) => {
      if (change.kind === "create") await createComment({ postId, content: change.content, ...(change.parentId ? { parentId: change.parentId } : {}) });
      else if (change.kind === "edit") await editComment(change.id, change.content);
      else await deleteComment(change.id);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey });
      void client.invalidateQueries({ queryKey: ["all-approve-post"] });
      void client.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: () => toast.error("Could not save your comment change. Please try again."),
    retry: false,
  });
  const change = async (value: Change) => { await mutation.mutateAsync(value); };
  const threads = Array.from(new Map(query.data?.pages.flatMap(page => page.comments).map(comment => [comment.id, comment])).values());
  const count = query.data?.pages[0]?.totalCount ?? initialCount;
  return <section id={`comments-${postId}`} aria-label="Post comments" className="border-t border-slate-200 text-slate-900 dark:border-slate-800 dark:text-slate-100">
    <div className="flex items-center justify-between px-5 py-3 sm:px-6">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`comment-panel-${postId}`} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-300 dark:hover:bg-slate-800"><MessageCircle className="size-5" />{open ? "Hide comments" : "Comment"}</button>
      <button type="button" onClick={() => setOpen(!open)} className="text-sm text-slate-500 hover:underline dark:text-slate-400">{count} {count === 1 ? "comment" : "comments"}</button>
    </div>
    {open && <div id={`comment-panel-${postId}`} className="space-y-5 px-5 pb-5 sm:px-6">
      {user ? <Composer name={user.name} image={user.image} autoFocus={!defaultOpen} onSubmit={content => change({ kind: "create", content })} /> : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400"><Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`} className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Log in</Link> to join the conversation.</p>}
      {query.isPending ? <AppLoader compact label="Loading comments..." className="justify-start" /> : query.isError ? <div role="alert" className="py-3 text-sm text-red-600"><p>Comments could not be loaded.</p><button onClick={() => void query.refetch()} className="mt-1 font-semibold underline">Try again</button></div> : threads.length === 0 ? <p className="py-4 text-center text-sm text-slate-500">No comments yet. Start the conversation.</p> : <>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Newest comments</p>
        <ul className="space-y-4">{threads.map(comment => <CommentThread key={comment.id} comment={comment} onChange={change} pending={mutation.isPending} />)}</ul>
        {query.hasNextPage && <button type="button" onClick={() => void query.fetchNextPage()} disabled={query.isFetchingNextPage} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline disabled:opacity-50 dark:text-emerald-400">{query.isFetchingNextPage && <LoaderCircle className="size-4 animate-spin" />}{query.isFetchingNextPage ? "Loading..." : "View more comments"}</button>}
        {query.isFetchNextPageError && <p role="alert" className="text-xs text-red-600">Could not load more comments. Try again.</p>}
      </>}
    </div>}
  </section>;
}

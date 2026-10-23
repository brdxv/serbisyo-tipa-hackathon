import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/dev-commentor.css";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  ListFilter,
  Maximize2,
  MessageCircle,
  MessageSquarePlus,
  Minus,
  Monitor,
  MousePointer2,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import devReviewCommentService from "../../services/devReviewCommentService.js";

const ENABLED_KEY = "serbisyo:dev-commentor-enabled:v1";
const LAST_BATCH_KEY = "serbisyo:dev-commentor-last-batch:v1";
const DRAFT_PREFIX = "serbisyo:dev-commentor-draft:v1:";
const ACTIVE_SESSION_KEY = "serbisyo:dev-commentor-active-session:v1";
const TOOLBAR_POSITION_KEY = "serbisyo:dev-commentor-toolbar-position:v1";
const COMPOSER_SIZE_KEY = "serbisyo:dev-commentor-composer-size:v1";
const HISTORY_RAIL_VISIBLE_KEY = "serbisyo:dev-commentor-history-rail-visible:v1";
const HISTORY_RAIL_POSITION_KEY = "serbisyo:dev-commentor-history-rail-position:v1";
const MAX_TARGET_TEXT = 260;
const COMPOSER_WIDTH = 430;
const COMPOSER_DEFAULT_HEIGHT = 620;
const COMPOSER_GAP = 14;
const VIEWPORT_MARGIN = 12;
const TOOLBAR_CLEARANCE = 68;
const MIN_CONTEXT_HEIGHT = 260;
const MOBILE_VIEWPORT_MAX_WIDTH = 767;
const COMPOSER_MIN_WIDTH = 278;
const COMPOSER_MIN_HEIGHT = 230;

const CATEGORIES = [
  ["ui_ux", "UI / UX"],
  ["bug", "Bug"],
  ["styling", "Styling / polish"],
  ["content", "Text / content"],
  ["behavior", "Behavior / logic"],
  ["accessibility", "Accessibility"],
  ["data", "Data / state"],
  ["other", "Other"],
];
const PRIORITIES = [["low", "Low"], ["medium", "Medium"], ["high", "High"], ["critical", "Critical"]];
const CATEGORY_VALUES = new Set(CATEGORIES.map(([value]) => value));

const compactText = (value = "") => String(value).replace(/\s+/g, " ").trim();
const readViewportContext = () => {
  if (typeof window === "undefined") return { target: "desktop", width: 0, height: 0 };
  const width = Math.round(document.documentElement?.clientWidth || window.innerWidth || 0);
  const height = Math.round(document.documentElement?.clientHeight || window.innerHeight || 0);
  return {
    target: width > 0 && width <= MOBILE_VIEWPORT_MAX_WIDTH ? "mobile" : "desktop",
    width,
    height,
  };
};
const viewportMetaFromComment = (comment) => {
  const meta = comment?.target_descriptor?.reviewViewport;
  if (!meta || !["mobile", "desktop"].includes(meta.target)) return null;
  return {
    target: meta.target,
    source: meta.source === "manual" ? "manual" : "auto",
    width: Number(meta.width) || 0,
    height: Number(meta.height) || 0,
  };
};
const normalizeCategoryList = (value) => {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  const normalized = source.map((item) => String(item || "").trim().toLowerCase()).filter((item) => CATEGORY_VALUES.has(item));
  return [...new Set(normalized)].length ? [...new Set(normalized)] : ["ui_ux"];
};
export const incrementBatchKey = (value = "Batch 1") => {
  const normalized = compactText(value) || "Batch 1";
  const match = normalized.match(/^(.*?)(\d+(?:\.\d+)*)$/);
  if (!match) return `${normalized}.1`;
  const segments = match[2].split(".");
  segments[segments.length - 1] = String(Number(segments[segments.length - 1]) + 1);
  return `${match[1]}${segments.join(".")}`;
};
export const smartBatchKey = (comments = [], preferred = "") => {
  const usable = comments.filter((comment) => comment?.batch_key && comment.status !== "archived");
  const preferredKey = compactText(preferred);
  const latestComment = usable.reduce((latest, comment) => {
    if (!latest) return comment;
    const latestTime = new Date(latest.updated_at || latest.created_at || 0).getTime();
    const commentTime = new Date(comment.updated_at || comment.created_at || 0).getTime();
    return commentTime >= latestTime ? comment : latest;
  }, null);
  const currentKey = preferredKey || latestComment?.batch_key || "Batch 1";
  const currentComments = usable.filter((comment) => comment.batch_key === currentKey);
  if (!currentComments.length) return currentKey;
  return currentComments.every((comment) => comment.status === "resolved") ? incrementBatchKey(currentKey) : currentKey;
};
const storageSafe = (value = "") => encodeURIComponent(String(value)).slice(0, 1200);
const cssEscape = (value = "") => typeof CSS !== "undefined" && CSS.escape ? CSS.escape(String(value)) : String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");

const isCommentorUi = (element) => Boolean(element?.closest?.(".dev-element-commentor-ui"));
const isInspectorUi = (element) => Boolean(
  element?.closest?.(".dev-typography-inspector-ui, .public-stroke-editor-ui, .public-sound-toggle, .dev-demo-fill-tool, .presentation-scope-edit-launcher, .presentation-scope-editor")
);
const isDesignEditorActive = () => Boolean(
  document.body.classList.contains("public-stroke-editor-active") ||
  document.body.classList.contains("public-visual-editor-active") ||
  document.body.classList.contains("public-text-editor-active") ||
  document.body.classList.contains("presentation-scope-editor-active") ||
  document.body.classList.contains("rps-picker-active") ||
  document.body.classList.contains("rps-mode-active")
);

const visibleRect = (element) => {
  if (!(element instanceof Element)) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return null;
  return rect;
};

const interactionPoint = (event) => {
  const source = event?.touches?.[0] || event?.changedTouches?.[0] || event;
  const clientX = Number(source?.clientX);
  const clientY = Number(source?.clientY);
  return Number.isFinite(clientX) && Number.isFinite(clientY) ? { clientX, clientY } : null;
};

const inspectionElementFromEvent = (event) => {
  const point = interactionPoint(event);
  if (point && typeof document?.elementFromPoint === "function") {
    const fromPoint = document.elementFromPoint(point.clientX, point.clientY);
    if (fromPoint instanceof Element) return fromPoint;
  }
  if (event?.target instanceof Element) return event.target;
  return event?.target?.parentElement instanceof Element ? event.target.parentElement : null;
};

const rectSnapshot = (element) => {
  const rect = visibleRect(element);
  if (!rect) return null;
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    pageX: rect.left + window.scrollX,
    pageY: rect.top + window.scrollY,
  };
};

const classTokens = (element) => {
  if (!element) return [];
  const value = typeof element.className === "string" ? element.className : element.getAttribute?.("class") || "";
  return String(value).split(/\s+/).filter((token) => token && token.length < 72 && !token.includes(":"));
};

const selectorFor = (element) => {
  if (!(element instanceof Element)) return "";
  if (element.id) return `#${cssEscape(element.id)}`;
  const testId = element.getAttribute("data-testid");
  if (testId) return `[data-testid="${String(testId).replace(/"/g, '\\"')}"]`;
  const parts = [];
  let current = element;
  for (let depth = 0; current && depth < 6 && current !== document.body; depth += 1, current = current.parentElement) {
    const tag = current.tagName.toLowerCase();
    if (current.id) {
      parts.unshift(`#${cssEscape(current.id)}`);
      break;
    }
    const classes = classTokens(current).filter((token) => !/^is-|^has-|^active$|^selected$|^hover/.test(token)).slice(0, 2);
    let part = `${tag}${classes.map((token) => `.${cssEscape(token)}`).join("")}`;
    const parent = current.parentElement;
    if (parent) {
      const sameTag = [...parent.children].filter((child) => child.tagName === current.tagName);
      if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    if (current.matches("article,section,nav,aside,form,[role='dialog'],[role='group']")) break;
  }
  return parts.join(" > ");
};

const descriptorFor = (element) => {
  const classes = classTokens(element);
  const lucideClass = classes.find((token) => token.startsWith("lucide-") && token !== "lucide-react");
  return {
    tag: element?.tagName?.toLowerCase?.() || "element",
    classes: classes.slice(0, 8),
    text: compactText(element?.innerText || element?.textContent || "").slice(0, MAX_TARGET_TEXT),
    ariaLabel: element?.getAttribute?.("aria-label") || "",
    title: element?.getAttribute?.("title") || "",
    role: element?.getAttribute?.("role") || "",
    icon: lucideClass ? lucideClass.replace(/^lucide-/, "") : "",
  };
};

const targetSnapshot = (element, kind = "single") => {
  const rect = rectSnapshot(element);
  if (!rect) return null;
  return {
    element,
    kind,
    selector: selectorFor(element),
    descriptor: descriptorFor(element),
    rect,
  };
};

const isGroupLike = (element) => {
  if (!(element instanceof Element)) return false;
  const rect = visibleRect(element);
  if (!rect || rect.width < 130 || rect.height < 55) return false;
  if (element.matches("article,section,nav,aside,form,fieldset,table,ul,ol,[role='group'],[role='region'],[role='dialog']")) return true;
  const classes = classTokens(element).join(" ").toLowerCase();
  if (/card|panel|widget|section|toolbar|summary|container|header|footer|grid|list/.test(classes) && element.children.length >= 2) return true;
  return element.children.length >= 3 && rect.width * rect.height >= 12000;
};

const normalizeSvgTarget = (element) => {
  if (!(element instanceof SVGElement)) return element;
  const svg = element.closest("svg");
  if (!svg) return element;
  const svgRect = visibleRect(svg);
  if (svgRect && svgRect.width <= 96 && svgRect.height <= 96) return svg;
  return element;
};

const findGroupCandidate = (element) => {
  return collectGroupCandidates(element)[0] || element?.parentElement || element;
};

const collectGroupCandidates = (element) => {
  if (!(element instanceof Element)) return [];
  const groups = [];
  const seen = new Set();
  let current = normalizeSvgTarget(element);
  for (let depth = 0; current && depth < 12 && current !== document.body && current !== document.documentElement; depth += 1, current = current.parentElement) {
    if (!isGroupLike(current) || seen.has(current)) continue;
    seen.add(current);
    groups.push(current);
  }
  if (!groups.length && element.parentElement && element.parentElement !== document.body) groups.push(element.parentElement);
  return groups;
};

const groupTargetHierarchy = (element) => collectGroupCandidates(element)
  .map((candidate) => targetSnapshot(candidate, "group"))
  .filter(Boolean);

const resolveTargetBundle = (start) => {
  if (!(start instanceof Element) || isCommentorUi(start) || isInspectorUi(start)) return null;
  const singleElement = normalizeSvgTarget(start);
  if (!visibleRect(singleElement)) return null;
  const groupElement = findGroupCandidate(singleElement);
  const groupTargets = groupTargetHierarchy(singleElement);
  const defaultKind = isGroupLike(singleElement) ? "group" : "single";
  return {
    defaultKind,
    singleTarget: targetSnapshot(singleElement, "single"),
    groupTarget: groupTargets[0] || targetSnapshot(groupElement, "group"),
    groupTargets,
  };
};

const descriptorCandidates = (descriptor = {}) => {
  if (typeof document === "undefined") return [];
  const tag = /^[a-z][a-z0-9-]*$/i.test(String(descriptor.tag || "")) ? String(descriptor.tag).toLowerCase() : "*";
  const classes = (Array.isArray(descriptor.classes) ? descriptor.classes : [])
    .filter((token) => token && !/^is-|^has-|^active$|^selected$|^hover/.test(token))
    .slice(0, 4);
  const selectors = [];
  if (descriptor.ariaLabel) selectors.push(`${tag}[aria-label="${cssEscape(descriptor.ariaLabel)}"]`);
  if (descriptor.title) selectors.push(`${tag}[title="${cssEscape(descriptor.title)}"]`);
  if (classes.length) selectors.push(`${tag}${classes.map((token) => `.${cssEscape(token)}`).join("")}`);
  if (classes.length > 1) selectors.push(`${tag}.${cssEscape(classes[0])}`);
  if (tag !== "*") selectors.push(tag);

  const candidates = [];
  const seen = new Set();
  selectors.forEach((selector) => {
    try {
      [...document.querySelectorAll(selector)].slice(0, 250).forEach((element) => {
        if (!seen.has(element)) {
          seen.add(element);
          candidates.push(element);
        }
      });
    } catch { /* A stale descriptor should not hide the rest of the comment queue. */ }
  });
  return candidates;
};

const scoreDescriptorCandidate = (element, descriptor = {}) => {
  const rect = visibleRect(element);
  if (!rect) return -1;
  const elementDescriptor = descriptorFor(element);
  let score = 0;
  if (descriptor.tag && elementDescriptor.tag === descriptor.tag) score += 2;
  if (descriptor.ariaLabel && elementDescriptor.ariaLabel === descriptor.ariaLabel) score += 14;
  if (descriptor.title && elementDescriptor.title === descriptor.title) score += 10;
  const expectedClasses = new Set(Array.isArray(descriptor.classes) ? descriptor.classes : []);
  elementDescriptor.classes.forEach((token) => { if (expectedClasses.has(token)) score += 4; });
  const expectedText = compactText(descriptor.text || "");
  const actualText = compactText(elementDescriptor.text || "");
  if (expectedText && actualText) {
    if (actualText === expectedText) score += 18;
    else if (actualText.includes(expectedText) || expectedText.includes(actualText)) score += 11;
    else {
      const anchor = expectedText.slice(0, Math.min(72, expectedText.length));
      if (anchor.length >= 12 && actualText.includes(anchor)) score += 7;
    }
  }
  return score;
};

/* Stored selectors are still the first choice, but development comments must
 * survive normal UI refactors. This descriptor fallback is especially
 * important for comments attached to click-opened overlays: the overlay can
 * disappear after saving, then mount again with a different nth-of-type. */
const resolveStoredCommentElement = (comment) => {
  if (!comment || typeof document === "undefined") return null;
  try {
    const exact = document.querySelector(comment.target_selector);
    if (visibleRect(exact)) return exact;
  } catch { /* Fall through to the descriptor recovery path. */ }

  const descriptor = comment.target_descriptor || {};
  let best = null;
  let bestScore = -1;
  descriptorCandidates(descriptor).forEach((candidate) => {
    const score = scoreDescriptorCandidate(candidate, descriptor);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  });
  const hasStrongIdentity = Boolean(descriptor.ariaLabel || descriptor.title || (descriptor.classes || []).length || compactText(descriptor.text).length >= 12);
  return hasStrongIdentity && bestScore >= 6 ? best : null;
};

const pageLabel = () => {
  const heading = [...document.querySelectorAll("h1,h2")].find((element) => visibleRect(element));
  return compactText(heading?.textContent || document.title || window.location.pathname).slice(0, 180);
};

const draftStorageKey = (route, selector, commentId = "new") => `${DRAFT_PREFIX}${storageSafe(route)}:${storageSafe(selector)}:${commentId}`;

const readLocalDraft = (key) => {
  if (!key) return null;
  try { return JSON.parse(window.localStorage.getItem(key) || "null"); } catch { return null; }
};
const removeLocalDraft = (key) => { if (key) window.localStorage.removeItem(key); };
const readActiveSession = () => {
  try { return JSON.parse(window.sessionStorage.getItem(ACTIVE_SESSION_KEY) || "null"); } catch { return null; }
};
const writeActiveSession = (value) => {
  try {
    if (!value) window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    else window.sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(value));
  } catch { /* Development review must remain usable when session storage is unavailable. */ }
};
const readToolbarPosition = () => {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(TOOLBAR_POSITION_KEY) || "null");
    return Number.isFinite(value?.left) && Number.isFinite(value?.top) ? value : null;
  } catch { return null; }
};
const writeToolbarPosition = (value) => {
  try {
    if (!value) window.localStorage.removeItem(TOOLBAR_POSITION_KEY);
    else window.localStorage.setItem(TOOLBAR_POSITION_KEY, JSON.stringify(value));
  } catch { /* A blocked localStorage must not disable the development toolbar. */ }
};
const readStoredBoxSize = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return Number.isFinite(value?.width) && Number.isFinite(value?.height) ? value : null;
  } catch { return null; }
};
const writeStoredBoxSize = (key, value) => {
  try {
    if (!value) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* Development resize preferences are optional. */ }
};
const readStoredPosition = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return Number.isFinite(value?.left) && Number.isFinite(value?.top) ? value : null;
  } catch { return null; }
};
const writeStoredPosition = (key, value) => {
  try {
    if (!value) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* Development rail position is optional. */ }
};
const readStoredBoolean = (key, fallback = true) => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value !== "0";
  } catch { return fallback; }
};
const writeStoredBoolean = (key, value) => {
  try { window.localStorage.setItem(key, value ? "1" : "0"); } catch { /* Optional development preference. */ }
};
const clampToolbarPosition = (position, width = 0, height = 0) => {
  if (!position || typeof window === "undefined") return position;
  const margin = 8;
  const maxLeft = Math.max(margin, window.innerWidth - Math.max(width, 220) - margin);
  const maxTop = Math.max(margin, window.innerHeight - Math.max(height, 44) - margin);
  return {
    left: Math.min(maxLeft, Math.max(margin, position.left)),
    top: Math.min(maxTop, Math.max(margin, position.top)),
  };
};
const clampFloatingPosition = (position, width = 0, height = 0, minWidth = 40, minHeight = 40) => {
  if (!position || typeof window === "undefined") return position;
  const margin = 8;
  const maxLeft = Math.max(margin, window.innerWidth - Math.max(width, minWidth) - margin);
  const maxTop = Math.max(margin, window.innerHeight - Math.max(height, minHeight) - margin);
  return {
    left: Math.min(maxLeft, Math.max(margin, position.left)),
    top: Math.min(maxTop, Math.max(margin, position.top)),
  };
};
const clampComposerSize = (size) => {
  if (!size || typeof window === "undefined") return size;
  const margin = 8;
  const maxWidth = Math.max(COMPOSER_MIN_WIDTH, window.innerWidth - margin * 2);
  const maxHeight = Math.max(COMPOSER_MIN_HEIGHT, window.innerHeight - margin * 2);
  return {
    width: Math.min(maxWidth, Math.max(COMPOSER_MIN_WIDTH, Number(size.width) || COMPOSER_WIDTH)),
    height: Math.min(maxHeight, Math.max(COMPOSER_MIN_HEIGHT, Number(size.height) || COMPOSER_DEFAULT_HEIGHT)),
  };
};

const commentPayload = (form, target, route, status, viewportContext = readViewportContext()) => ({
  route,
  page_label: pageLabel(),
  target_kind: form.targetKind,
  target_selector: target?.selector || "",
  target_descriptor: {
    ...(target?.descriptor || {}),
    reviewViewport: {
      target: form.viewportTarget || viewportContext.target,
      source: form.viewportSource === "manual" ? "manual" : "auto",
      width: viewportContext.width,
      height: viewportContext.height,
      mobileMaxWidth: MOBILE_VIEWPORT_MAX_WIDTH,
    },
  },
  target_rect: target?.rect ? {
    pageX: Math.round(target.rect.pageX),
    pageY: Math.round(target.rect.pageY),
    width: Math.round(target.rect.width),
    height: Math.round(target.rect.height),
  } : {},
  title: form.title,
  comment_text: form.commentText,
  batch_key: form.batchKey,
  category: normalizeCategoryList(form.categories)[0],
  categories: normalizeCategoryList(form.categories),
  priority: form.priority,
  status,
});

const promptForComments = (comments, batchLabel) => {
  const actionable = comments.filter((comment) => comment.status === "saved");
  const header = `SERBISYO DEVELOPMENT REVIEW — ${batchLabel}\nExecute the following saved review comments as one implementation batch. Treat each target selector/description as context, preserve unrelated behavior, and validate the affected pages after the changes.`;
  if (!actionable.length) return `${header}\n\nNo saved comments are currently in this batch.`;
  return `${header}\n\n${actionable.map((comment, index) => {
    const descriptor = comment.target_descriptor || {};
    const viewportMeta = viewportMetaFromComment(comment);
    const targetSummary = [descriptor.tag, descriptor.icon ? `icon:${descriptor.icon}` : "", descriptor.ariaLabel ? `aria:${descriptor.ariaLabel}` : ""].filter(Boolean).join(" · ");
    const categoryLabel = normalizeCategoryList(comment.categories || comment.category).join(", ");
    const viewportLine = viewportMeta ? `\nViewport: ${viewportMeta.target === "mobile" ? "Mobile" : "Non-mobile"}${viewportMeta.width ? ` · ${viewportMeta.width}×${viewportMeta.height}` : ""}${viewportMeta.source === "manual" ? " · manual override" : " · auto-detected"}` : "";
    return `${index + 1}. [${String(comment.priority || "medium").toUpperCase()}] [${categoryLabel}] ${comment.title || "Untitled review comment"}\nRoute: ${comment.route}${viewportLine}\nTarget: ${comment.target_kind} · ${targetSummary || "element"}\nSelector: ${comment.target_selector}\nVisible text: ${descriptor.text || "(none)"}\nComment: ${comment.comment_text}`;
  }).join("\n\n")}`;
};

const initialForm = (bundle, draft, batch, viewportContext = readViewportContext()) => ({
  targetKind: draft?.targetKind || bundle?.defaultKind || "single",
  title: draft?.title || "",
  commentText: draft?.commentText || "",
  batchKey: draft?.batchKey || batch || "Batch 1",
  categories: normalizeCategoryList(draft?.categories || draft?.category || "ui_ux"),
  priority: draft?.priority || "medium",
  viewportTarget: draft?.viewportTarget || viewportContext.target,
  viewportSource: draft?.viewportSource === "manual" ? "manual" : "auto",
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const placeComposerNearTarget = (targetRect, composerSize = {}, { preserveSize = false } = {}) => {
  if (!targetRect || typeof window === "undefined") return null;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(Number(composerSize.width) || COMPOSER_WIDTH, Math.max(280, viewportWidth - VIEWPORT_MARGIN * 2));
  const fullViewportHeight = Math.max(COMPOSER_MIN_HEIGHT, viewportHeight - VIEWPORT_MARGIN * 2);
  const standardContextHeight = Math.max(MIN_CONTEXT_HEIGHT, viewportHeight - TOOLBAR_CLEARANCE - VIEWPORT_MARGIN);
  const naturalHeight = Math.min(
    Number(composerSize.height) || COMPOSER_DEFAULT_HEIGHT,
    preserveSize ? fullViewportHeight : standardContextHeight
  );
  const rightSpace = viewportWidth - targetRect.right - COMPOSER_GAP - VIEWPORT_MARGIN;
  const leftSpace = targetRect.left - COMPOSER_GAP - VIEWPORT_MARGIN;
  const belowSpace = viewportHeight - targetRect.bottom - COMPOSER_GAP - VIEWPORT_MARGIN;
  const aboveSpace = targetRect.top - COMPOSER_GAP - TOOLBAR_CLEARANCE;
  const centerY = targetRect.top + targetRect.height / 2;
  const centerX = targetRect.left + targetRect.width / 2;
  const topClearance = preserveSize && naturalHeight > standardContextHeight
    ? VIEWPORT_MARGIN
    : TOOLBAR_CLEARANCE;
  const maxVerticalHeight = Math.max(MIN_CONTEXT_HEIGHT, viewportHeight - topClearance - VIEWPORT_MARGIN);
  const desiredHeight = Math.min(naturalHeight, maxVerticalHeight);

  if (rightSpace >= width) {
    const height = Math.min(naturalHeight, maxVerticalHeight);
    return {
      placement: "right",
      left: targetRect.right + COMPOSER_GAP,
      top: clamp(centerY - height / 2, topClearance, viewportHeight - VIEWPORT_MARGIN - height),
      width,
      maxHeight: height,
    };
  }
  if (leftSpace >= width) {
    const height = Math.min(naturalHeight, maxVerticalHeight);
    return {
      placement: "left",
      left: targetRect.left - COMPOSER_GAP - width,
      top: clamp(centerY - height / 2, topClearance, viewportHeight - VIEWPORT_MARGIN - height),
      width,
      maxHeight: height,
    };
  }
  /* Do not shrink a user-sized composer merely to squeeze it directly below
     the selected target. If the configured height does not fit there, fall
     through to the floating placement so the window keeps its preferred size. */
  if (belowSpace >= desiredHeight) {
    return {
      placement: "below",
      left: clamp(centerX - width / 2, VIEWPORT_MARGIN, viewportWidth - VIEWPORT_MARGIN - width),
      top: targetRect.bottom + COMPOSER_GAP,
      width,
      maxHeight: desiredHeight,
    };
  }
  if (aboveSpace >= desiredHeight) {
    return {
      placement: "above",
      left: clamp(centerX - width / 2, VIEWPORT_MARGIN, viewportWidth - VIEWPORT_MARGIN - width),
      top: targetRect.top - COMPOSER_GAP - desiredHeight,
      width,
      maxHeight: desiredHeight,
    };
  }

  const height = desiredHeight;
  const favorRight = rightSpace >= leftSpace;
  return {
    placement: "floating",
    left: clamp(
      favorRight ? targetRect.right + COMPOSER_GAP : targetRect.left - COMPOSER_GAP - width,
      VIEWPORT_MARGIN,
      viewportWidth - VIEWPORT_MARGIN - width
    ),
    top: clamp(centerY - height / 2, topClearance, viewportHeight - VIEWPORT_MARGIN - height),
    width,
    maxHeight: height,
  };
};

export const resizeComposerBox = (startRect, edge, dx, dy, viewport = {}) => {
  const margin = 8;
  const viewportWidth = Number(viewport.width) || (typeof window !== "undefined" ? window.innerWidth : 0);
  const viewportHeight = Number(viewport.height) || (typeof window !== "undefined" ? window.innerHeight : 0);
  let left = Number(startRect.left) || 0;
  let top = Number(startRect.top) || 0;
  let right = Number(startRect.right) || (left + (Number(startRect.width) || COMPOSER_MIN_WIDTH));
  let bottom = Number(startRect.bottom) || (top + (Number(startRect.height) || COMPOSER_MIN_HEIGHT));

  if (edge.includes("w")) {
    left = Math.min(right - COMPOSER_MIN_WIDTH, Math.max(margin, left + dx));
  }
  if (edge.includes("e")) {
    right = Math.max(left + COMPOSER_MIN_WIDTH, Math.min(viewportWidth - margin, right + dx));
  }
  if (edge.includes("n")) {
    top = Math.min(bottom - COMPOSER_MIN_HEIGHT, Math.max(margin, top + dy));
  }
  if (edge.includes("s")) {
    bottom = Math.max(top + COMPOSER_MIN_HEIGHT, Math.min(viewportHeight - margin, bottom + dy));
  }

  return {
    position: { left, top },
    size: {
      width: right - left,
      height: bottom - top,
    },
  };
};

/* Development-only review cue for the current Graphite V1 dark-mode pass.
 * Keeping this inside the Commentor avoids adding temporary completion badges
 * to the real product navigation. The user can immediately see whether the
 * page is ready for visual comments while moving through the aside menu. */
const GRAPHITE_DARK_REVIEW_ROUTES = [
  { match: /^\/dashboard$/, label: "Dashboard", description: "Comment-informed Graphite rules active · neutral structure, semantic data colors preserved" },
  { match: /^\/(?:inbox|youth\/inbox|school-cpc\/inbox|it\/inbox)(?:\/|$)/, label: "Inbox", description: "Comment-informed Graphite rules active · message hierarchy ready for review" },
  { match: /^\/(?:cases|youth\/cases|school-cpc\/cases)(?:\/|$)/, label: "Case Management", description: "Comment-informed Graphite rules active · overview, monitoring, thread and files normalized" },
  { match: /^\/reports(?:\/|$)/, label: "Reports", description: "Comment-informed Graphite rules active · builders, tables and overlays normalized" },
  { match: /^\/(?:settings|it\/settings|developer\/settings)(?:\/|$)/, label: "Settings", description: "Comment-informed Graphite rules active · neutral structure with meaningful switches retained" },
  { match: /^\/(?:support|it\/support)(?:\/|$)/, label: "Support", description: "Comment-informed Graphite rules active · structural fills neutral, emergency/resource meaning retained" },
  { match: /^\/(?:youth|school-cpc|teacher)(?:\/|$)/, label: "Shared workspace", description: "Shared Graphite conversion contract active · role-specific semantic features preserved" },
  { match: /^\/(?:it-dashboard|it(?:\/|$)|admin\/accounts|developer)(?:\/|$)/, label: "Administration", description: "Shared Graphite conversion contract active · administrative structure normalized" },
];

const graphiteDarkReviewStatusFor = (route = "") => GRAPHITE_DARK_REVIEW_ROUTES.find((entry) => entry.match.test(route)) || null;

const canonicalCommentRoute = (value = "/") => {
  let route = String(value || "/").split("?")[0].replace(/\/+$/, "") || "/";
  route = route.replace(/\/guided$/, "") || "/";
  route = route.replace(/^(\/cases\/[^/]+)\/overview$/, "$1");
  return route;
};
const sameCommentRoute = (left, right) => canonicalCommentRoute(left) === canonicalCommentRoute(right);

export default function DevElementCommentor() {
  const [enabled, setEnabled] = useState(() => import.meta.env.DEV && typeof window !== "undefined" && window.localStorage.getItem(ENABLED_KEY) !== "0");
  const [route, setRoute] = useState(() => typeof window !== "undefined" ? window.location.pathname : "/");
  const [hoverBundle, setHoverBundle] = useState(null);
  const [composer, setComposer] = useState(null);
  const [form, setForm] = useState(null);
  const [comments, setComments] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [draftState, setDraftState] = useState("");
  const [markerRects, setMarkerRects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendSyncState, setBackendSyncState] = useState("idle");
  const [unmatchedPageCommentIds, setUnmatchedPageCommentIds] = useState([]);
  const [liveTargetRect, setLiveTargetRect] = useState(null);
  const [composerPlacement, setComposerPlacement] = useState(null);
  const [composerManualPosition, setComposerManualPosition] = useState(null);
  const [composerDragging, setComposerDragging] = useState(false);
  const [composerMinimized, setComposerMinimized] = useState(false);
  /* Keep the persisted dimensions as the user's preferred size. Viewport
     clamping is applied only while rendering, so a temporary narrow viewport
     cannot permanently collapse the remembered composer dimensions. */
  /* The editor always owns a stable preferred box size, even before the user
     has manually resized it. Target-aware placement may move the box but must
     never derive a smaller height from the newly selected element. */
  const [composerSize, setComposerSize] = useState(() => (
    readStoredBoxSize(COMPOSER_SIZE_KEY)
    || { width: COMPOSER_WIDTH, height: COMPOSER_DEFAULT_HEIGHT }
  ));
  const [composerResizing, setComposerResizing] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState(readToolbarPosition);
  const [toolbarDragging, setToolbarDragging] = useState(false);
  const [historyRailVisible, setHistoryRailVisible] = useState(() => readStoredBoolean(HISTORY_RAIL_VISIBLE_KEY, true));
  const [historyRailPosition, setHistoryRailPosition] = useState(() => readStoredPosition(HISTORY_RAIL_POSITION_KEY));
  const [historyRailDragging, setHistoryRailDragging] = useState(false);
  const [viewportContext, setViewportContext] = useState(readViewportContext);
  const noticeTimerRef = useRef(null);
  const composerRef = useRef(null);
  const composerDragRef = useRef(null);
  const composerResizeRef = useRef(null);
  const toolbarRef = useRef(null);
  const toolbarDragRef = useRef(null);
  const historyRailRef = useRef(null);
  const historyRailDragRef = useRef(null);
  const commentTextAreaRef = useRef(null);
  const lastCommentorFocusRef = useRef(null);
  const hoverElementRef = useRef(null);
  const graphiteDarkReviewStatus = useMemo(() => graphiteDarkReviewStatusFor(route), [route]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let frame = 0;
    const updateViewportContext = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setViewportContext(readViewportContext()));
    };
    window.addEventListener("resize", updateViewportContext);
    window.visualViewport?.addEventListener("resize", updateViewportContext);
    updateViewportContext();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateViewportContext);
      window.visualViewport?.removeEventListener("resize", updateViewportContext);
    };
  }, []);

  useEffect(() => {
    if (!form || form.viewportSource === "manual" || form.viewportTarget === viewportContext.target) return;
    setForm((current) => current && current.viewportSource !== "manual"
      ? { ...current, viewportTarget: viewportContext.target, viewportSource: "auto" }
      : current);
  }, [form?.viewportSource, form?.viewportTarget, viewportContext.target]);

  const flash = useCallback((message) => {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2600);
  }, []);

  const beginToolbarDrag = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest?.("button,label,select,input,textarea,a,kbd")) return;
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const rect = toolbar.getBoundingClientRect();
    toolbarDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setToolbarDragging(true);
    event.preventDefault();
  }, []);

  const beginComposerDrag = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!event.target.closest?.(".dev-element-commentor-composer>header")) return;
    if (event.target.closest?.("button,input,textarea,select,a")) return;
    const node = composerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    composerDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: Math.min(rect.height, window.innerHeight - 16),
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setComposerDragging(true);
    setComposerManualPosition({ left: rect.left, top: rect.top });
    event.preventDefault();
  }, []);

  const beginComposerResize = useCallback((event, edge) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const node = composerRef.current;
    if (!node || composerMinimized) return;
    const rect = node.getBoundingClientRect();
    composerResizeRef.current = {
      pointerId: event.pointerId,
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      startRight: rect.right,
      startBottom: rect.bottom,
      startWidth: rect.width,
      startHeight: rect.height,
      lastPosition: { left: rect.left, top: rect.top },
      lastSize: { width: rect.width, height: rect.height },
    };
    setComposerManualPosition({ left: rect.left, top: rect.top });
    // Preserve the user's stored dimensions. The rendered box can be temporarily
    // smaller than the preference because of viewport constraints.
    setComposerResizing(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }, [composerMinimized]);

  const beginHistoryRailDrag = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest?.("button")) return;
    const node = historyRailRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    historyRailDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    setHistoryRailPosition({ left: rect.left, top: rect.top });
    setHistoryRailDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const moveToolbarDrag = useCallback((event) => {
    const drag = toolbarDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const next = clampToolbarPosition({
      left: event.clientX - drag.offsetX,
      top: event.clientY - drag.offsetY,
    }, drag.width, drag.height);
    setToolbarPosition(next);
  }, []);

  const moveComposerDrag = useCallback((event) => {
    const drag = composerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setComposerManualPosition(clampToolbarPosition({
      left: event.clientX - drag.offsetX,
      top: event.clientY - drag.offsetY,
    }, drag.width, drag.height));
  }, []);

  const moveComposerResize = useCallback((event) => {
    const drag = composerResizeRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const next = resizeComposerBox({
      left: drag.startLeft,
      top: drag.startTop,
      right: drag.startRight,
      bottom: drag.startBottom,
      width: drag.startWidth,
      height: drag.startHeight,
    }, drag.edge, dx, dy, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    drag.lastPosition = next.position;
    drag.lastSize = next.size;
    setComposerManualPosition(next.position);
    setComposerSize(next.size);
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const moveHistoryRailDrag = useCallback((event) => {
    const drag = historyRailDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const next = clampFloatingPosition({
      left: event.clientX - drag.offsetX,
      top: event.clientY - drag.offsetY,
    }, drag.width, drag.height);
    setHistoryRailPosition(next);
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const finishToolbarDrag = useCallback((event) => {
    const drag = toolbarDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    toolbarDragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setToolbarDragging(false);
    setToolbarPosition((current) => {
      const next = clampToolbarPosition(current, toolbarRef.current?.offsetWidth, toolbarRef.current?.offsetHeight);
      writeToolbarPosition(next);
      return next;
    });
  }, []);

  const finishComposerDrag = useCallback((event) => {
    const drag = composerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    composerDragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setComposerDragging(false);
    setComposerManualPosition((current) => clampToolbarPosition(
      current,
      composerRef.current?.offsetWidth,
      Math.min(composerRef.current?.offsetHeight || 0, window.innerHeight - 16),
    ));
  }, []);

  const finishComposerResize = useCallback((event) => {
    const drag = composerResizeRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    composerResizeRef.current = null;
    event.currentTarget?.releasePointerCapture?.(event.pointerId);
    setComposerResizing(false);
    /* Do not re-measure the DOM here. React may not have painted the final
       pointermove state yet, which used to make pointer-up overwrite the
       intended size with a stale smaller rectangle. Persist the synchronous
       geometry calculated by the last pointermove instead. */
    const nextSize = drag.lastSize || {
      width: drag.startWidth,
      height: drag.startHeight,
    };
    const nextPosition = drag.lastPosition || { left: drag.startLeft, top: drag.startTop };
    setComposerSize(nextSize);
    setComposerManualPosition(nextPosition);
    writeStoredBoxSize(COMPOSER_SIZE_KEY, nextSize);
  }, []);

  const finishHistoryRailDrag = useCallback((event) => {
    const drag = historyRailDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    historyRailDragRef.current = null;
    event.currentTarget?.releasePointerCapture?.(event.pointerId);
    setHistoryRailDragging(false);
    setHistoryRailPosition((current) => {
      const next = clampFloatingPosition(
        current,
        historyRailRef.current?.offsetWidth,
        historyRailRef.current?.offsetHeight,
      );
      writeStoredPosition(HISTORY_RAIL_POSITION_KEY, next);
      return next;
    });
  }, []);

  const resetComposerPosition = useCallback(() => {
    composerDragRef.current = null;
    setComposerDragging(false);
    setComposerManualPosition(null);
    flash("Comment editor returned to automatic placement");
  }, [flash]);

  const toggleComposerMinimized = useCallback(() => {
    const node = composerRef.current;
    if (!composerMinimized && node) {
      const rect = node.getBoundingClientRect();
      setComposerManualPosition({ left: rect.left, top: rect.top });
    }
    setComposerMinimized((current) => !current);
  }, [composerMinimized]);

  const resetToolbarPosition = useCallback(() => {
    writeToolbarPosition(null);
    setToolbarPosition(null);
    flash("Commentor toolbar position reset");
  }, [flash]);

  const toggleHistoryRail = useCallback(() => {
    setHistoryRailVisible((current) => {
      const next = !current;
      writeStoredBoolean(HISTORY_RAIL_VISIBLE_KEY, next);
      return next;
    });
  }, []);

  const resetHistoryRailPosition = useCallback(() => {
    historyRailDragRef.current = null;
    setHistoryRailDragging(false);
    setHistoryRailPosition(null);
    writeStoredPosition(HISTORY_RAIL_POSITION_KEY, null);
    flash("Hidden-comments rail position reset");
  }, [flash]);

  useEffect(() => {
    if (!toolbarPosition) return undefined;
    let frame = 0;
    const clampPosition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setToolbarPosition((current) => {
        const next = clampToolbarPosition(current, toolbarRef.current?.offsetWidth, toolbarRef.current?.offsetHeight);
        writeToolbarPosition(next);
        return next;
      }));
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(clampPosition);
    if (toolbarRef.current) observer?.observe(toolbarRef.current);
    clampPosition();
    window.addEventListener("resize", clampPosition);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", clampPosition);
    };
  }, [Boolean(toolbarPosition)]);

  useEffect(() => {
    if (!toolbarDragging) return undefined;
    window.addEventListener("pointermove", moveToolbarDrag, true);
    window.addEventListener("pointerup", finishToolbarDrag, true);
    window.addEventListener("pointercancel", finishToolbarDrag, true);
    return () => {
      window.removeEventListener("pointermove", moveToolbarDrag, true);
      window.removeEventListener("pointerup", finishToolbarDrag, true);
      window.removeEventListener("pointercancel", finishToolbarDrag, true);
    };
  }, [finishToolbarDrag, moveToolbarDrag, toolbarDragging]);

  useEffect(() => {
    if (!composerDragging) return undefined;
    window.addEventListener("pointermove", moveComposerDrag, true);
    window.addEventListener("pointerup", finishComposerDrag, true);
    window.addEventListener("pointercancel", finishComposerDrag, true);
    return () => {
      window.removeEventListener("pointermove", moveComposerDrag, true);
      window.removeEventListener("pointerup", finishComposerDrag, true);
      window.removeEventListener("pointercancel", finishComposerDrag, true);
    };
  }, [composerDragging, finishComposerDrag, moveComposerDrag]);

  useEffect(() => {
    if (!composerResizing) return undefined;
    window.addEventListener("pointermove", moveComposerResize, true);
    window.addEventListener("pointerup", finishComposerResize, true);
    window.addEventListener("pointercancel", finishComposerResize, true);
    return () => {
      window.removeEventListener("pointermove", moveComposerResize, true);
      window.removeEventListener("pointerup", finishComposerResize, true);
      window.removeEventListener("pointercancel", finishComposerResize, true);
    };
  }, [composerResizing, finishComposerResize, moveComposerResize]);

  useEffect(() => {
    if (!historyRailDragging) return undefined;
    window.addEventListener("pointermove", moveHistoryRailDrag, true);
    window.addEventListener("pointerup", finishHistoryRailDrag, true);
    window.addEventListener("pointercancel", finishHistoryRailDrag, true);
    return () => {
      window.removeEventListener("pointermove", moveHistoryRailDrag, true);
      window.removeEventListener("pointerup", finishHistoryRailDrag, true);
      window.removeEventListener("pointercancel", finishHistoryRailDrag, true);
    };
  }, [finishHistoryRailDrag, historyRailDragging, moveHistoryRailDrag]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const clampFloatingUi = () => {
      const visibleSize = clampComposerSize(composerSize);
      if (visibleSize && composerManualPosition) {
        setComposerManualPosition((current) => clampFloatingPosition(
          current,
          visibleSize.width,
          composerMinimized ? composerRef.current?.offsetHeight : visibleSize.height,
          COMPOSER_MIN_WIDTH,
          composerMinimized ? 44 : COMPOSER_MIN_HEIGHT,
        ));
      }
      if (historyRailPosition) {
        setHistoryRailPosition((current) => clampFloatingPosition(
          current,
          historyRailRef.current?.offsetWidth,
          historyRailRef.current?.offsetHeight,
        ));
      }
    };
    window.addEventListener("resize", clampFloatingUi);
    window.visualViewport?.addEventListener("resize", clampFloatingUi);
    return () => {
      window.removeEventListener("resize", clampFloatingUi);
      window.visualViewport?.removeEventListener("resize", clampFloatingUi);
    };
  }, [composerManualPosition, composerMinimized, composerSize, historyRailPosition]);

  const refreshComments = useCallback(async () => {
    if (!import.meta.env.DEV) return;
    setLoading(true);
    setBackendSyncState("loading");
    try {
      const response = await devReviewCommentService.list();
      const data = response?.data || response;
      setComments(Array.isArray(data?.comments) ? data.comments : []);
      setBackendSyncState("synced");
      return true;
    } catch (error) {
      setBackendSyncState("error");
      flash(error?.message || "Could not load review comments");
      return false;
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    let holdTimer = null;
    const clearHoldTimer = () => {
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      holdTimer = null;
    };
    const toggleCommentor = () => {
      setEnabled((current) => {
        const next = !current;
        window.localStorage.setItem(ENABLED_KEY, next ? "1" : "0");
        return next;
      });
    };
    const handleShortcut = (event) => {
      if (!event.ctrlKey || event.metaKey || event.altKey || event.key.toLowerCase() !== "c") return;
      const dashboardVersionSwitcher = document.querySelector('[data-dashboard-dark-version-switcher="true"]');
      if (dashboardVersionSwitcher && !event.altKey) return;
      if (event.shiftKey) {
        if (event.repeat) return;
        event.preventDefault();
        clearHoldTimer();
        toggleCommentor();
        return;
      }
      const target = event.target;
      const selection = window.getSelection?.();
      const hasTextSelection = Boolean(selection && !selection.isCollapsed && String(selection).trim());
      const isEditableTarget = target instanceof HTMLElement
        && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      // A held Ctrl+C opens the Commentor only when it is not being used to
      // copy selected/editable text, preserving the normal copy shortcut.
      if (hasTextSelection || isEditableTarget) return;
      if (event.repeat || holdTimer !== null) return;
      holdTimer = window.setTimeout(() => {
        holdTimer = null;
        toggleCommentor();
      }, 1000);
    };
    const releaseShortcut = (event) => {
      const key = String(event.key || "").toLowerCase();
      if (key === "c" || key === "control") clearHoldTimer();
    };
    window.addEventListener("keydown", handleShortcut, true);
    window.addEventListener("keyup", releaseShortcut, true);
    window.addEventListener("blur", clearHoldTimer);
    return () => {
      clearHoldTimer();
      window.removeEventListener("keydown", handleShortcut, true);
      window.removeEventListener("keyup", releaseShortcut, true);
      window.removeEventListener("blur", clearHoldTimer);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("dev-element-commentor-active");
      hoverElementRef.current = null;
      setHoverBundle(null);
      setComposer(null);
      setForm(null);
      setLiveTargetRect(null);
      setComposerPlacement(null);
      setComposerManualPosition(null);
      setComposerDragging(false);
      setComposerMinimized(false);
      setComposerResizing(false);
      composerResizeRef.current = null;
      setPanelOpen(false);
      if (!enabled) writeActiveSession(null);
      return undefined;
    }
    document.body.classList.add("dev-element-commentor-active");
    void refreshComments();
    return () => document.body.classList.remove("dev-element-commentor-active");
  }, [enabled, refreshComments, route]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    const interval = window.setInterval(() => {
      const next = window.location.pathname;
      setRoute((current) => {
        if (current === next) return current;
        if (!sameCommentRoute(current, next)) {
          writeActiveSession(null);
          setHoverBundle(null);
          setComposer(null);
          setForm(null);
          setComposerManualPosition(null);
          setComposerDragging(false);
          setComposerMinimized(false);
          setComposerResizing(false);
          composerResizeRef.current = null;
        }
        return next;
      });
    }, 350);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!enabled || composer || form) return;
    const session = readActiveSession();
    if (!session || !sameCommentRoute(session.route, route) || !session.selector) return;
    let element = null;
    try { element = document.querySelector(session.selector); } catch { element = null; }
    if (!element) {
      writeActiveSession(null);
      return;
    }
    const targetKind = session.form?.targetKind || session.targetKind || "single";
    let singleElement = element;
    if (session.singleSelector) {
      try { singleElement = document.querySelector(session.singleSelector) || element; } catch { singleElement = element; }
    }
    singleElement = normalizeSvgTarget(singleElement);
    const singleTarget = targetSnapshot(singleElement, "single");
    if (!singleTarget) return;
    const groupTargets = groupTargetHierarchy(singleElement);
    const desiredGroupIndex = targetKind === "group"
      ? Math.max(0, groupTargets.findIndex((target) => target.selector === session.selector))
      : Math.max(0, Number(session.groupIndex) || 0);
    const groupIndex = Math.min(Math.max(0, desiredGroupIndex), Math.max(0, groupTargets.length - 1));
    const groupTarget = groupTargets[groupIndex] || targetSnapshot(findGroupCandidate(singleElement), "group");
    const recoveredForm = session.form || readLocalDraft(session.draftKey);
    if (!recoveredForm) {
      writeActiveSession(null);
      return;
    }
    setComposer({
      commentId: session.commentId || null,
      draftKey: session.draftKey || draftStorageKey(route, session.selector, session.commentId || "new"),
      singleTarget,
      groupTarget,
      groupTargets,
      groupIndex,
    });
    setComposerMinimized(false);
    setComposerResizing(false);
    setForm(recoveredForm);
    setDraftState("Recovered after interface refresh");
    window.requestAnimationFrame(() => commentTextAreaRef.current?.focus({ preventScroll: true }));
  }, [composer, enabled, form, route]);

  const batches = useMemo(() => {
    const values = new Set(comments.map((comment) => comment.batch_key).filter(Boolean));
    if (!values.size) values.add("Batch 1");
    return [...values].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [comments]);

  const pageComments = useMemo(() => comments.filter((comment) => sameCommentRoute(comment.route, route) && comment.status !== "archived"), [comments, route]);
  const filteredPageComments = useMemo(() => pageComments.filter((comment) => batchFilter === "all" || comment.batch_key === batchFilter), [batchFilter, pageComments]);

  const refreshMarkerRects = useCallback(() => {
    if (!enabled) return;
    const unmatched = [];
    const next = filteredPageComments.map((comment, index) => {
      const element = resolveStoredCommentElement(comment);
      const rect = visibleRect(element);
      if (!rect) {
        unmatched.push(String(comment.id));
        return null;
      }
      return { comment, index, rect, recoveredTarget: selectorFor(element) !== comment.target_selector, sidebarTarget: false };
    }).filter(Boolean);
    setMarkerRects(next);
    setUnmatchedPageCommentIds(unmatched);
  }, [enabled, filteredPageComments, route]);

  useEffect(() => {
    if (!enabled) return undefined;
    refreshMarkerRects();
    const handle = () => refreshMarkerRects();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    const interval = window.setInterval(handle, 900);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
      window.clearInterval(interval);
    };
  }, [enabled, refreshMarkerRects, route]);

  const activeTarget = useMemo(() => {
    if (!composer || !form) return null;
    return form.targetKind === "group"
      ? composer.groupTargets?.[composer.groupIndex || 0] || composer.groupTarget || composer.singleTarget
      : composer.singleTarget || composer.groupTarget;
  }, [composer, form]);

  useEffect(() => {
    if (!composer || !activeTarget) {
      setLiveTargetRect(null);
      setComposerPlacement(null);
      return undefined;
    }

    let frame = 0;
    let resizeObserver = null;
    const updatePlacement = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const currentRect = activeTarget.element?.isConnected
          ? visibleRect(activeTarget.element)
          : activeTarget.rect;
        if (!currentRect) {
          setLiveTargetRect(null);
          setComposerPlacement(null);
          return;
        }
        const nextRect = {
          top: currentRect.top,
          left: currentRect.left,
          right: currentRect.right,
          bottom: currentRect.bottom,
          width: currentRect.width,
          height: currentRect.height,
        };
        setLiveTargetRect(nextRect);
        const composerElement = composerRef.current;
        const preferredVisibleSize = clampComposerSize(composerSize);
        setComposerPlacement(placeComposerNearTarget(nextRect, {
          width: preferredVisibleSize?.width || composerElement?.offsetWidth || COMPOSER_WIDTH,
          height: preferredVisibleSize?.height || composerElement?.scrollHeight || composerElement?.offsetHeight || COMPOSER_DEFAULT_HEIGHT,
        }, { preserveSize: true }));
      });
    };

    updatePlacement();
    window.addEventListener("scroll", updatePlacement, true);
    window.addEventListener("resize", updatePlacement);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updatePlacement);
      if (composerRef.current) resizeObserver.observe(composerRef.current);
      if (activeTarget.element?.isConnected) resizeObserver.observe(activeTarget.element);
    }
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePlacement, true);
      window.removeEventListener("resize", updatePlacement);
      resizeObserver?.disconnect();
    };
  }, [activeTarget, composer, composerSize]);

  const closeComposer = () => {
    writeActiveSession(null);
    setComposer(null);
    setForm(null);
    setLiveTargetRect(null);
    setComposerPlacement(null);
    setComposerManualPosition(null);
    setComposerDragging(false);
    setComposerMinimized(false);
    setComposerResizing(false);
    composerDragRef.current = null;
    composerResizeRef.current = null;
    setDraftState("");
  };

  const openExisting = useCallback((comment) => {
    const element = resolveStoredCommentElement(comment);
    const singleTarget = element ? targetSnapshot(normalizeSvgTarget(element), "single") : {
      element: null,
      kind: "single",
      selector: comment.target_selector,
      descriptor: comment.target_descriptor || {},
      rect: null,
    };
    const groupTargets = element ? groupTargetHierarchy(element) : [];
    const groupElement = element ? findGroupCandidate(element) : null;
    const groupTarget = groupTargets[0] || (groupElement ? targetSnapshot(groupElement, "group") : null);
    const key = draftStorageKey(comment.route, comment.target_selector, comment.id);
    const draft = readLocalDraft(key);
    const storedViewport = viewportMetaFromComment(comment);
    const currentViewport = readViewportContext();
    setComposer({ commentId: comment.id, draftKey: key, singleTarget, groupTarget, groupTargets, groupIndex: 0 });
    setComposerManualPosition(null);
    setComposerDragging(false);
    setComposerMinimized(false);
    setComposerResizing(false);
    setForm({
      targetKind: draft?.targetKind || comment.target_kind || "single",
      title: draft?.title ?? comment.title ?? "",
      commentText: draft?.commentText ?? comment.comment_text ?? "",
      batchKey: draft?.batchKey || comment.batch_key || "Batch 1",
      categories: normalizeCategoryList(draft?.categories || draft?.category || comment.categories || comment.category || "ui_ux"),
      priority: draft?.priority || comment.priority || "medium",
      viewportTarget: draft?.viewportTarget || storedViewport?.target || currentViewport.target,
      viewportSource: draft?.viewportSource || storedViewport?.source || "auto",
    });
    setDraftState(draft ? "Recovered local draft" : "");
    setPanelOpen(false);
  }, []);

  const openNew = useCallback((bundle) => {
    if (!bundle) return;
    const target = bundle.defaultKind === "group" ? bundle.groupTarget : bundle.singleTarget;
    const existingDraft = comments.find((comment) => sameCommentRoute(comment.route, route) && comment.status === "draft" && comment.target_selector === target?.selector);
    if (existingDraft) {
      openExisting(existingDraft);
      return;
    }
    const key = draftStorageKey(route, target?.selector || "unknown");
    const draft = readLocalDraft(key);
    const preferredBatch = window.localStorage.getItem(LAST_BATCH_KEY) || "";
    const suggestedBatch = smartBatchKey(comments, preferredBatch);
    setComposer({ commentId: null, draftKey: key, singleTarget: bundle.singleTarget, groupTarget: bundle.groupTarget, groupTargets: bundle.groupTargets || [], groupIndex: 0 });
    setComposerManualPosition(null);
    setComposerDragging(false);
    setComposerMinimized(false);
    setComposerResizing(false);
    setForm(initialForm(bundle, draft, suggestedBatch, readViewportContext()));
    setDraftState(draft ? "Recovered local draft" : "");
    setPanelOpen(false);
  }, [comments, openExisting, route]);

  useEffect(() => {
    if (!enabled) return undefined;
    let hoverFrame = 0;

    const updateHoverFromElement = (element) => {
      if (!(element instanceof Element) || composer || isDesignEditorActive() || isCommentorUi(element) || isInspectorUi(element)) {
        hoverElementRef.current = null;
        setHoverBundle(null);
        return;
      }
      hoverElementRef.current = element;
      setHoverBundle(resolveTargetBundle(element));
    };

    const handleHoverInteraction = (event) => {
      const element = inspectionElementFromEvent(event);
      window.cancelAnimationFrame(hoverFrame);
      hoverFrame = window.requestAnimationFrame(() => updateHoverFromElement(element));
    };

    const refreshHoverRect = () => {
      const element = hoverElementRef.current;
      if (!(element instanceof Element) || !element.isConnected || composer || isDesignEditorActive()) return;
      window.cancelAnimationFrame(hoverFrame);
      hoverFrame = window.requestAnimationFrame(() => setHoverBundle(resolveTargetBundle(element)));
    };

    const handleClick = (event) => {
      const element = inspectionElementFromEvent(event);
      if (isDesignEditorActive() || isCommentorUi(element) || isInspectorUi(element)) return;
      const bundle = resolveTargetBundle(element);
      if (!bundle) return;
      event.preventDefault();
      event.stopPropagation();
      openNew(bundle);
    };
    const handleKey = (event) => {
      if (event.key === "Escape" && composer) closeComposer();
    };

    document.addEventListener("pointermove", handleHoverInteraction, true);
    document.addEventListener("pointerover", handleHoverInteraction, true);
    document.addEventListener("mousemove", handleHoverInteraction, true);
    document.addEventListener("mouseover", handleHoverInteraction, true);
    document.addEventListener("touchstart", handleHoverInteraction, { capture: true, passive: true });
    document.addEventListener("touchmove", handleHoverInteraction, { capture: true, passive: true });
    document.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", refreshHoverRect, true);
    window.addEventListener("resize", refreshHoverRect);
    window.visualViewport?.addEventListener("scroll", refreshHoverRect);
    window.visualViewport?.addEventListener("resize", refreshHoverRect);
    window.addEventListener("keydown", handleKey, true);
    return () => {
      window.cancelAnimationFrame(hoverFrame);
      document.removeEventListener("pointermove", handleHoverInteraction, true);
      document.removeEventListener("pointerover", handleHoverInteraction, true);
      document.removeEventListener("mousemove", handleHoverInteraction, true);
      document.removeEventListener("mouseover", handleHoverInteraction, true);
      document.removeEventListener("touchstart", handleHoverInteraction, true);
      document.removeEventListener("touchmove", handleHoverInteraction, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", refreshHoverRect, true);
      window.removeEventListener("resize", refreshHoverRect);
      window.visualViewport?.removeEventListener("scroll", refreshHoverRect);
      window.visualViewport?.removeEventListener("resize", refreshHoverRect);
      window.removeEventListener("keydown", handleKey, true);
    };
  }, [composer, enabled, openNew, route]);

  useEffect(() => {
    if (!composer || !form) return;
    const savedAt = new Date().toISOString();
    try {
      window.localStorage.setItem(composer.draftKey, JSON.stringify({ ...form, savedAt }));
      window.localStorage.setItem(LAST_BATCH_KEY, form.batchKey || "Batch 1");
    } catch { /* Keep the development commentor usable if local storage is temporarily unavailable. */ }
    writeActiveSession({
      route,
      selector: activeTarget?.selector || composer.singleTarget?.selector || composer.groupTarget?.selector || "",
      singleSelector: composer.singleTarget?.selector || "",
      targetKind: form.targetKind,
      groupIndex: composer.groupIndex || 0,
      commentId: composer.commentId || null,
      draftKey: composer.draftKey,
      form: { ...form, savedAt },
    });
    setDraftState("Draft autosaved locally");
  }, [activeTarget?.selector, composer, form, route]);

  useEffect(() => {
    if (!composer || !form) return undefined;
    const restoreFocus = () => {
      const active = document.activeElement;
      if (active === document.body || active === document.documentElement || !active) {
        window.requestAnimationFrame(() => commentTextAreaRef.current?.focus({ preventScroll: true }));
      }
    };
    const handleVisibility = () => { if (document.visibilityState === "visible") restoreFocus(); };
    window.addEventListener("focus", restoreFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", restoreFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [composer, form]);

  useEffect(() => {
    if (!composer || !form) return undefined;
    const preserveCommentorFocus = (event) => {
      const nextTarget = event.target;
      if (isCommentorUi(nextTarget)) {
        lastCommentorFocusRef.current = nextTarget;
        return;
      }
      const previousTarget = lastCommentorFocusRef.current;
      if (!(previousTarget instanceof HTMLElement) || !previousTarget.isConnected) return;
      window.requestAnimationFrame(() => {
        if (composerRef.current && !composerRef.current.contains(document.activeElement)) {
          previousTarget.focus({ preventScroll: true });
        }
      });
    };
    document.addEventListener("focusin", preserveCommentorFocus, true);
    return () => document.removeEventListener("focusin", preserveCommentorFocus, true);
  }, [composer, form]);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const stepGroupHierarchy = (delta) => {
    if (!composer || !form) return;
    const targets = composer.groupTargets || (composer.groupTarget ? [composer.groupTarget] : []);
    if (!targets.length) return;
    const currentIndex = Math.min(Math.max(0, composer.groupIndex || 0), targets.length - 1);

    if (delta > 0) {
      if (form.targetKind !== "group") {
        setComposer((current) => current ? { ...current, groupIndex: 0, groupTarget: targets[0] } : current);
        updateForm("targetKind", "group");
        return;
      }
      const nextIndex = Math.min(currentIndex + 1, targets.length - 1);
      if (nextIndex !== currentIndex) setComposer((current) => current ? { ...current, groupIndex: nextIndex, groupTarget: targets[nextIndex] } : current);
      return;
    }

    if (form.targetKind === "group" && currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      setComposer((current) => current ? { ...current, groupIndex: nextIndex, groupTarget: targets[nextIndex] } : current);
      return;
    }
    if (form.targetKind === "group") updateForm("targetKind", "single");
  };
  const toggleCategory = (category) => setForm((current) => {
    const selected = normalizeCategoryList(current?.categories);
    const next = selected.includes(category) ? selected.filter((item) => item !== category) : [...selected, category];
    return { ...current, categories: next.length ? next : [category] };
  });
  const useAutomaticViewport = () => setForm((current) => current
    ? { ...current, viewportTarget: viewportContext.target, viewportSource: "auto" }
    : current);
  const useManualViewport = (target) => setForm((current) => current
    ? { ...current, viewportTarget: target, viewportSource: "manual" }
    : current);

  const persistComment = async (status) => {
    if (!composer || !form || !activeTarget?.selector) return;
    if (status === "saved" && !form.commentText.trim()) {
      flash("Add the comment before saving.");
      return;
    }
    const payload = commentPayload(form, activeTarget, route, status, viewportContext);
    try {
      const response = composer.commentId
        ? await devReviewCommentService.update(composer.commentId, payload)
        : await devReviewCommentService.create(payload);
      const saved = response?.data || response;
      if (saved?.id) {
        setComments((current) => {
          const existingIndex = current.findIndex((comment) => String(comment.id) === String(saved.id));
          if (existingIndex < 0) return [...current, saved];
          return current.map((comment, index) => index === existingIndex ? saved : comment);
        });
      }
      removeLocalDraft(composer.draftKey);
      window.localStorage.setItem(LAST_BATCH_KEY, form.batchKey || "Batch 1");
      await refreshComments();
      flash(status === "draft" ? "Draft saved to project database" : "Comment saved to project database");
      if (status === "saved") closeComposer();
      else {
        const nextKey = draftStorageKey(route, saved.target_selector || activeTarget.selector, saved.id);
        setComposer((current) => ({ ...current, commentId: saved.id, draftKey: nextKey }));
        setDraftState("Project draft saved");
      }
    } catch (error) {
      flash(error?.message || "Could not save review comment");
    }
  };

  const deleteCurrent = async () => {
    if (!composer) return;
    if (composer.commentId && !window.confirm("Delete this review comment?")) return;
    try {
      if (composer.commentId) await devReviewCommentService.remove(composer.commentId);
      removeLocalDraft(composer.draftKey);
      await refreshComments();
      closeComposer();
      flash("Comment deleted");
    } catch (error) {
      flash(error?.message || "Could not delete review comment");
    }
  };

  const setCommentStatus = async (commentId, status, { closeAfter = false, draftKey = "" } = {}) => {
    if (!commentId || !["saved", "resolved"].includes(status)) return;
    try {
      const currentComment = comments.find((comment) => String(comment.id) === String(commentId));
      await devReviewCommentService.update(commentId, { status });
      if (status === "saved" && currentComment?.batch_key) window.localStorage.setItem(LAST_BATCH_KEY, currentComment.batch_key);
      if (status === "resolved" && draftKey) removeLocalDraft(draftKey);
      await refreshComments();
      if (closeAfter) closeComposer();
      flash(status === "resolved" ? "Comment marked resolved" : "Comment unresolved and returned to the active queue");
    } catch (error) {
      flash(error?.message || (status === "resolved" ? "Could not resolve comment" : "Could not unresolve comment"));
    }
  };

  const markResolved = async () => {
    if (!composer?.commentId) return;
    await setCommentStatus(composer.commentId, "resolved", { closeAfter: true, draftKey: composer.draftKey });
  };

  const markUnresolved = async () => {
    if (!composer?.commentId) return;
    await setCommentStatus(composer.commentId, "saved");
  };

  const copyBatchPrompt = async () => {
    const selected = batchFilter === "all"
      ? comments.filter((comment) => comment.status === "saved")
      : comments.filter((comment) => comment.batch_key === batchFilter && comment.status === "saved");
    const label = batchFilter === "all" ? "All batches" : batchFilter;
    try {
      await navigator.clipboard.writeText(promptForComments(selected, label));
      flash(`${label} prompt copied`);
    } catch {
      flash("Clipboard is unavailable");
    }
  };

  if (!import.meta.env.DEV || !enabled || typeof document === "undefined") return null;

  const hoverTarget = hoverBundle
    ? (hoverBundle.defaultKind === "group" ? hoverBundle.groupTarget : hoverBundle.singleTarget)
    : null;
  const outlineTarget = activeTarget || hoverTarget;
  const outlineRect = activeTarget ? (liveTargetRect || activeTarget.rect) : hoverTarget?.rect;
  const activeComment = composer?.commentId ? comments.find((comment) => String(comment.id) === String(composer.commentId)) : null;
  const activeCommentResolved = activeComment?.status === "resolved";
  const visiblePageCommentIds = new Set(markerRects.map(({ comment }) => String(comment.id)));
  const unmatchedPageComments = filteredPageComments.filter((comment) => unmatchedPageCommentIds.includes(String(comment.id)));
  const activeGroupTargets = composer?.groupTargets || (composer?.groupTarget ? [composer.groupTarget] : []);
  const activeGroupIndex = Math.min(Math.max(0, composer?.groupIndex || 0), Math.max(0, activeGroupTargets.length - 1));
  const composerBaseStyle = composerManualPosition ? {
    top: composerManualPosition.top,
    left: composerManualPosition.left,
    right: "auto",
  } : composerPlacement ? {
    top: composerPlacement.top,
    left: composerPlacement.left,
    right: "auto",
  } : {};
  const visibleComposerSize = clampComposerSize(composerSize);
  /* Placement controls position only. It must never become a second sizing
     system: otherwise selecting a target with less nearby space can silently
     reduce the editor height and make the window appear to collapse upward. */
  const composerAvailableHeight = Math.max(COMPOSER_MIN_HEIGHT, window.innerHeight - VIEWPORT_MARGIN * 2);
  const composerStyle = {
    ...composerBaseStyle,
    width: visibleComposerSize?.width || composerPlacement?.width || COMPOSER_WIDTH,
    ...(composerMinimized ? {
      height: "auto",
      maxHeight: "none",
    } : visibleComposerSize ? {
      height: Math.min(visibleComposerSize.height, composerAvailableHeight),
      maxHeight: composerAvailableHeight,
    } : {
      maxHeight: composerAvailableHeight,
    }),
  };

  return createPortal(
    <div className="dev-element-commentor-ui" aria-live="polite">
      {outlineRect ? <div
        className={`dev-element-commentor-target is-${activeTarget ? form?.targetKind : hoverBundle?.defaultKind || "single"} ${activeTarget ? "is-selected" : ""}`}
        style={{ top: outlineRect.top, left: outlineRect.left, width: outlineRect.width, height: outlineRect.height }}
      ><span>{activeTarget ? (form?.targetKind === "group" ? "Group target" : "Element target") : (hoverBundle?.defaultKind === "group" ? "Group" : "Element")}</span></div> : null}

      {markerRects.map(({ comment, index, rect }) => <button
        aria-label={`Open review comment ${index + 1}: ${comment.title || "Untitled"}`}
        className={`dev-element-commentor-marker is-${comment.priority || "medium"} ${comment.status === "draft" ? "is-draft" : ""} ${comment.status === "resolved" ? "is-resolved" : ""}`}
        key={comment.id}
        onClick={() => openExisting(comment)}
        style={{ top: Math.max(8, rect.top - 12), left: Math.max(8, rect.right - 12) }}
        title={`${comment.batch_key} · ${comment.title || "Review comment"}`}
        type="button"
      ><MessageCircle size={12}/><b>{index + 1}</b></button>)}

      {unmatchedPageComments.length && historyRailVisible ? <aside
        className={`dev-element-commentor-history-rail ${historyRailDragging ? "is-dragging" : ""}`}
        aria-label="Saved comments whose targets are currently hidden"
        ref={historyRailRef}
        style={historyRailPosition ? { top: historyRailPosition.top, left: historyRailPosition.left, right: "auto" } : undefined}
      >
        <header
          onDoubleClick={(event) => { if (!event.target.closest?.("button")) resetHistoryRailPosition(); }}
          onPointerDown={beginHistoryRailDrag}
          title="Drag to move hidden comments. Double-click to reset."
        ><GripVertical size={11}/><MessageCircle size={12}/><span><strong>{unmatchedPageComments.length}</strong> hidden</span><button aria-label="Hide hidden comments rail" onClick={toggleHistoryRail} type="button"><EyeOff size={11}/></button></header>
        <div>
          {unmatchedPageComments.map((comment) => {
            const index = filteredPageComments.findIndex((item) => String(item.id) === String(comment.id));
            return <button
              aria-label={`Open hidden review comment ${index + 1}: ${comment.title || "Untitled"}`}
              className={`dev-element-commentor-history-marker is-${comment.priority || "medium"} ${comment.status === "resolved" ? "is-resolved" : ""}`}
              key={comment.id}
              onClick={() => openExisting(comment)}
              title={`${comment.batch_key} · ${comment.status} · ${comment.title || "Review comment"}`}
              type="button"
            ><MessageCircle size={11}/><b>{index + 1}</b></button>;
          })}
        </div>
      </aside> : null}

      <div
        className={`dev-element-commentor-toolbar ${toolbarDragging ? "is-dragging" : ""}`}
        onDoubleClick={(event) => { if (event.target.closest?.(".dev-element-commentor-toolbar-drag-zone")) resetToolbarPosition(); }}
        onPointerCancel={finishToolbarDrag}
        onPointerDown={beginToolbarDrag}
        onPointerMove={moveToolbarDrag}
        onPointerUp={finishToolbarDrag}
        ref={toolbarRef}
        style={toolbarPosition ? { top: toolbarPosition.top, left: toolbarPosition.left, right: "auto", transform: "none" } : undefined}
      >
        <span className="dev-element-commentor-toolbar-drag-zone" title="Drag to move the UI Commentor. Double-click to reset its position."><GripVertical aria-hidden="true" size={14}/><span className="dev-element-commentor-brand"><MessageSquarePlus size={15}/><strong>UI Commentor</strong></span><span className="dev-element-commentor-route">{route}</span></span>
        <span className={`dev-element-commentor-viewport-indicator is-${viewportContext.target}`} title={`Auto-detected from the current CSS viewport. Mobile is ${MOBILE_VIEWPORT_MAX_WIDTH}px wide or below.`}>{viewportContext.target === "mobile" ? <Smartphone size={12}/> : <Monitor size={12}/>}<span><strong>{viewportContext.target === "mobile" ? "Mobile" : "Non-mobile"}</strong><small>{viewportContext.width}×{viewportContext.height}</small></span></span>
        {graphiteDarkReviewStatus ? <span className="dev-element-commentor-review-status" title={graphiteDarkReviewStatus.description}><Check size={12}/><span><strong>{graphiteDarkReviewStatus.label}</strong><small>{graphiteDarkReviewStatus.description}</small></span></span> : null}
        <span className={`dev-element-commentor-storage-state is-${backendSyncState}`} title={`${comments.length} comments are stored in the project database. ${filteredPageComments.length - unmatchedPageCommentIds.length} current-page targets are mounted right now; hidden overlay targets remain stored.`}><strong>{comments.length}</strong> DB · <strong>{filteredPageComments.length}</strong> page · <strong>{filteredPageComments.length - unmatchedPageCommentIds.length}</strong> visible</span>
        <label><ListFilter size={13}/><select aria-label="Filter comments by batch" onChange={(event) => setBatchFilter(event.target.value)} value={batchFilter}><option value="all">All batches</option>{batches.map((batch) => <option key={batch} value={batch}>{batch}</option>)}</select></label>
        {unmatchedPageComments.length ? <button aria-pressed={historyRailVisible} className={historyRailVisible ? "is-active" : ""} onClick={toggleHistoryRail} title={historyRailVisible ? "Hide hidden-comments rail" : "Show hidden-comments rail"} type="button">{historyRailVisible ? <Eye size={14}/> : <EyeOff size={14}/>}<span>{unmatchedPageComments.length} hidden</span></button> : null}
        <button className={panelOpen ? "is-active" : ""} onClick={() => setPanelOpen((current) => !current)} type="button"><MessageCircle size={14}/><span>{filteredPageComments.length} stored</span></button>
        <kbd>Ctrl + Shift + C</kbd>
        <button aria-label="Turn off UI Commentor" className="is-icon" onClick={() => { window.localStorage.setItem(ENABLED_KEY, "0"); setEnabled(false); }} type="button"><X size={15}/></button>
      </div>

      {notice ? <div className="dev-element-commentor-toast"><Check size={14}/>{notice}</div> : null}

      {panelOpen ? <aside className="dev-element-commentor-panel">
        <header><div><small>Development review</small><strong>{batchFilter === "all" ? "All comment batches" : batchFilter}</strong><span>{loading ? "Loading…" : `${comments.filter((comment) => batchFilter === "all" || comment.batch_key === batchFilter).length} total comments`}</span></div><button aria-label="Close comment list" onClick={() => setPanelOpen(false)} type="button"><X size={16}/></button></header>
        <div className="dev-element-commentor-panel-actions"><button onClick={copyBatchPrompt} type="button"><Copy size={13}/>Copy {batchFilter === "all" ? "all" : batchFilter} as prompt</button><button onClick={() => void refreshComments()} type="button">Refresh</button></div>
        <p className="dev-element-commentor-status-note"><Check size={12}/>Resolved comments stay in review history but are excluded from implementation prompts. Unresolve any item to return it to the active queue.</p>
        <div className="dev-element-commentor-list">
          {comments.filter((comment) => batchFilter === "all" || comment.batch_key === batchFilter).map((comment) => { const targetUnavailable = sameCommentRoute(comment.route, route) && !visiblePageCommentIds.has(String(comment.id)); const viewportMeta = viewportMetaFromComment(comment); return <article className={`is-${comment.status} ${targetUnavailable ? "is-target-unavailable" : ""}`} key={comment.id}>
            <button className="dev-element-commentor-list-main" onClick={() => openExisting(comment)} type="button"><span><b>{comment.batch_key}</b><em>{comment.status}</em><em>{comment.priority}</em>{viewportMeta ? <em className={`is-viewport-${viewportMeta.target}`}>{viewportMeta.target === "mobile" ? "mobile" : "non-mobile"}</em> : null}</span><strong>{comment.title || "Untitled comment"}</strong><p>{comment.comment_text || "Empty project draft"}</p><small>{normalizeCategoryList(comment.categories || comment.category).join(" · ")} · {comment.route} · {comment.target_kind}{viewportMeta?.width ? ` · ${viewportMeta.width}×${viewportMeta.height}` : ""}</small></button>
            {targetUnavailable ? <span className="dev-element-commentor-target-state">Saved in database · target is currently hidden or unmounted. Reopen the related overlay/menu to restore its marker.</span> : null}
            {comment.status === "resolved"
              ? <button aria-label={`Unresolve ${comment.title || "review comment"}`} className="dev-element-commentor-list-status is-unresolve" onClick={() => void setCommentStatus(comment.id, "saved")} type="button"><RotateCcw size={12}/>Unresolve</button>
              : comment.status === "saved"
                ? <button aria-label={`Resolve ${comment.title || "review comment"}`} className="dev-element-commentor-list-status is-resolve" onClick={() => void setCommentStatus(comment.id, "resolved")} type="button"><Check size={12}/>Resolve</button>
                : null}
          </article>; })}
          {!comments.filter((comment) => batchFilter === "all" || comment.batch_key === batchFilter).length ? <div className="dev-element-commentor-empty"><MessageCircle size={22}/><strong>No comments in this view</strong><span>Hover any interface element and click it to leave the first comment.</span></div> : null}
        </div>
      </aside> : null}

      {composer && form ? <aside
        className={`dev-element-commentor-composer ${composerManualPosition ? "is-manually-positioned" : composerPlacement?.placement ? `is-placement-${composerPlacement.placement}` : "is-placement-fallback"} ${composerDragging ? "is-dragging" : ""} ${composerResizing ? "is-resizing" : ""} ${composerMinimized ? "is-minimized" : ""}`}
        data-placement={composerManualPosition ? "manual" : composerPlacement?.placement || "fallback"}
        ref={composerRef}
        onFocusCapture={(event) => { lastCommentorFocusRef.current = event.target; }}
        style={composerStyle}
      >
        <header
          className="dev-element-commentor-composer-drag-handle"
          onDoubleClick={(event) => { if (!event.target.closest?.("button")) resetComposerPosition(); }}
          onPointerCancel={finishComposerDrag}
          onPointerDown={beginComposerDrag}
          onPointerMove={moveComposerDrag}
          onPointerUp={finishComposerDrag}
          title="Drag this header to move the comment editor. Double-click to return to automatic placement."
        ><div><small>{composer.commentId ? "Edit review comment" : "New review comment"}</small><strong>{form.targetKind === "group" ? "Group / container" : "Specific element"}</strong><span>{activeTarget?.descriptor?.ariaLabel || activeTarget?.descriptor?.text || activeTarget?.descriptor?.icon || activeTarget?.descriptor?.tag}</span></div><nav className="dev-element-commentor-composer-header-actions" aria-label="Comment editor window controls"><button aria-label={composerMinimized ? "Restore comment composer" : "Minimize comment composer"} onClick={toggleComposerMinimized} title={composerMinimized ? "Restore comment editor" : "Minimize comment editor"} type="button">{composerMinimized ? <Maximize2 size={15}/> : <Minus size={16}/>}</button><button aria-label="Close comment composer" onClick={closeComposer} type="button"><X size={17}/></button></nav></header>

        <div className="dev-element-commentor-composer-body">
        <div className="dev-element-commentor-target-mode" role="group" aria-label="Comment target scope">
          <button aria-pressed={form.targetKind === "single"} className={form.targetKind === "single" ? "is-active" : ""} disabled={!composer.singleTarget} onClick={() => updateForm("targetKind", "single")} type="button"><MousePointer2 size={14}/><span>Element</span><small>Only this item</small></button>
          <button aria-pressed={form.targetKind === "group"} className={form.targetKind === "group" ? "is-active" : ""} disabled={!composer.groupTarget} onClick={() => updateForm("targetKind", "group")} type="button"><Layers size={14}/><span>Group</span><small>Containing section</small></button>
        </div>

        {activeGroupTargets.length ? <div className="dev-element-commentor-group-depth" aria-label="Group hierarchy level">
          <button aria-label="Move one level down toward the selected element" disabled={form.targetKind !== "group"} onClick={() => stepGroupHierarchy(-1)} title={form.targetKind === "group" ? "Smaller / nearer group" : "Already at the element"} type="button"><Minus size={15}/></button>
          <span><Layers size={13}/><strong>{form.targetKind === "group" ? `Group level ${activeGroupIndex + 1} of ${activeGroupTargets.length}` : `Element · ${activeGroupTargets.length} containing group${activeGroupTargets.length === 1 ? "" : "s"}`}</strong><small>{form.targetKind !== "group" ? "Press + to enter the nearest group" : activeGroupIndex === 0 ? "Nearest containing group" : activeGroupIndex === activeGroupTargets.length - 1 ? "Largest detected group" : "Containing parent group"}</small></span>
          <button aria-label="Move one level up to a larger containing group" disabled={form.targetKind === "group" && activeGroupIndex >= activeGroupTargets.length - 1} onClick={() => stepGroupHierarchy(1)} title={form.targetKind === "group" ? "Larger / parent group" : "Enter nearest group"} type="button"><Plus size={15}/></button>
        </div> : null}

        <div className="dev-element-commentor-target-summary"><code>{activeTarget?.selector || "Target unavailable"}</code><span>{activeTarget?.descriptor?.tag}{activeTarget?.descriptor?.icon ? ` · ${activeTarget.descriptor.icon} icon` : ""}</span></div>

        <div className="dev-element-commentor-form">
          <label><span>Title <small>Short task summary</small></span><input maxLength="180" onChange={(event) => updateForm("title", event.target.value)} placeholder="What should change?" value={form.title}/></label>
          <label className="is-comment"><span>Comment <small>Describe the issue or intended result</small></span><textarea autoFocus maxLength="12000" onChange={(event) => updateForm("commentText", event.target.value)} placeholder="Leave the implementation note here…" ref={commentTextAreaRef} rows="7" value={form.commentText}/><small className="dev-element-commentor-draft-state">{draftState || "Draft autosaves while you type"}</small></label>
          <div className="dev-element-commentor-form-grid">
            <label><span>Batch <small>Smart auto-fill</small></span><input list="dev-commentor-batches" maxLength="80" onChange={(event) => updateForm("batchKey", event.target.value)} placeholder="Batch 1" value={form.batchKey}/><datalist id="dev-commentor-batches">{batches.map((batch) => <option key={batch} value={batch}/>)}</datalist></label>
            <label><span>Priority</span><select onChange={(event) => updateForm("priority", event.target.value)} value={form.priority}>{PRIORITIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <div className="dev-element-commentor-viewport-field">
            <span>Viewport <small>Auto-detected from the preview; override only when the comment targets another layout.</small></span>
            <div className="dev-element-commentor-viewport-options" role="group" aria-label="Comment viewport target">
              <button aria-pressed={form.viewportSource !== "manual"} className={form.viewportSource !== "manual" ? "is-selected" : ""} onClick={useAutomaticViewport} type="button">{viewportContext.target === "mobile" ? <Smartphone size={12}/> : <Monitor size={12}/>}<strong>Auto</strong><small>{viewportContext.target === "mobile" ? "Mobile" : "Non-mobile"} · {viewportContext.width}×{viewportContext.height}</small></button>
              <button aria-pressed={form.viewportSource === "manual" && form.viewportTarget === "mobile"} className={form.viewportSource === "manual" && form.viewportTarget === "mobile" ? "is-selected" : ""} onClick={() => useManualViewport("mobile")} type="button"><Smartphone size={12}/><strong>Mobile</strong><small>Manual override</small></button>
              <button aria-pressed={form.viewportSource === "manual" && form.viewportTarget === "desktop"} className={form.viewportSource === "manual" && form.viewportTarget === "desktop" ? "is-selected" : ""} onClick={() => useManualViewport("desktop")} type="button"><Monitor size={12}/><strong>Non-mobile</strong><small>Manual override</small></button>
            </div>
          </div>
          <div className="dev-element-commentor-category-field"><span>Comment type <small>Select all that apply</small></span><div aria-label="Comment types" className="dev-element-commentor-category-grid" role="group">{CATEGORIES.map(([value, label]) => { const selected = normalizeCategoryList(form.categories).includes(value); return <button aria-pressed={selected} className={selected ? "is-selected" : ""} key={value} onClick={() => toggleCategory(value)} type="button"><Check size={11}/>{label}</button>; })}</div></div>
        </div>
        </div>

        <footer>
          <div><button className="is-secondary" onClick={() => void persistComment("draft")} type="button"><Save size={14}/>Save draft</button>{composer.commentId ? activeCommentResolved ? <button className="is-unresolve" onClick={markUnresolved} type="button"><RotateCcw size={14}/>Unresolve</button> : <button className="is-resolve" onClick={markResolved} type="button"><Check size={14}/>Resolve</button> : null}<button className="is-danger" onClick={deleteCurrent} type="button"><Trash2 size={14}/>{composer.commentId ? "Delete" : "Discard"}</button></div>
          <button className="is-primary" disabled={!form.commentText.trim() || !form.batchKey.trim()} onClick={() => void persistComment("saved")} type="button"><MessageSquarePlus size={14}/>Save comment</button>
        </footer>
        {!composerMinimized ? ["n", "ne", "e", "se", "s", "sw", "w", "nw"].map((edge) => <span
          aria-hidden="true"
          className={`dev-element-commentor-resize-handle is-${edge}`}
          key={edge}
          onPointerDown={(event) => beginComposerResize(event, edge)}
        />) : null}
      </aside> : null}
    </div>,
    document.body
  );
}

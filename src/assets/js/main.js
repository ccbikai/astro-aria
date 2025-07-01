// Add your javascript here

window.darkMode = false

// ===== 系统深色方案监测 =====
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

// ----- Sticky-header 与菜单常量 -----
const stickyClasses = ['fixed', 'h-14']
const unstickyClasses = ['absolute', 'h-20']
const stickyClassesContainer = [
  'border-neutral-300/50',
  'bg-white/80',
  'dark:border-neutral-600/40',
  'dark:bg-neutral-900/60',
  'backdrop-blur-2xl',
]
const unstickyClassesContainer = ['border-transparent']

let headerElement = null

document.addEventListener('DOMContentLoaded', () => {
  headerElement = document.getElementById('header')

  // 1. 初始化主题
  const stored = localStorage.getItem('dark_mode')
  if (stored === 'true') {
    window.darkMode = true
    showNight()
  } else if (stored === 'false') {
    window.darkMode = false
    showDay()
  } else {
    prefersDarkScheme.matches ? showNight() : showDay()
  }

  // 2. 跟随系统（无用户偏好时）
  prefersDarkScheme.addEventListener('change', e => {
    if (localStorage.getItem('dark_mode') !== null) return
    e.matches ? showNight(true) : showDay(true)
  })

  // 其余初始化
  stickyHeaderFuncionality()
  applyMenuItemClasses()
  evaluateHeaderPosition()
  mobileMenuFunctionality()
})

// ===================== 粘性页眉 =====================
window.stickyHeaderFuncionality = () => {
  window.addEventListener('scroll', evaluateHeaderPosition)
}

window.evaluateHeaderPosition = () => {
  if (window.scrollY > 16) {
    headerElement.firstElementChild.classList.add(...stickyClassesContainer)
    headerElement.firstElementChild.classList.remove(...unstickyClassesContainer)
    headerElement.classList.add(...stickyClasses)
    headerElement.classList.remove(...unstickyClasses)
    document.getElementById('menu').classList.add('top-[56px]')
    document.getElementById('menu').classList.remove('top-[75px]')
  } else {
    headerElement.firstElementChild.classList.remove(...stickyClassesContainer)
    headerElement.firstElementChild.classList.add(...unstickyClassesContainer)
    headerElement.classList.add(...unstickyClasses)
    headerElement.classList.remove(...stickyClasses)
    document.getElementById('menu').classList.remove('top-[56px]')
    document.getElementById('menu').classList.add('top-[75px]')
  }
}

// ===================== 主题切换按钮 =====================
document.getElementById('darkToggle').addEventListener('click', () => {
  document.documentElement.classList.add('duration-300')

  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('dark_mode', 'false')
    window.darkMode = false
    showDay(true)
  } else {
    localStorage.setItem('dark_mode', 'true')
    window.darkMode = true
    showNight(true)
  }
})

// ===================== Day / Night 显示辅助 =====================
function showDay(animate = false) {
  const sun = document.getElementById('sun')
  const moon = document.getElementById('moon')

  sun.classList.remove('setting')
  moon.classList.remove('rising')

  let timeout = 0
  if (animate) {
    timeout = 500
    moon.classList.add('setting')
  }

  setTimeout(() => {
    moon.classList.add('hidden')
    sun.classList.remove('hidden')
    document.documentElement.classList.remove('dark')
    if (animate) sun.classList.add('rising')
  }, timeout)
}

function showNight(animate = false) {
  const sun = document.getElementById('sun')
  const moon = document.getElementById('moon')

  moon.classList.remove('setting')
  sun.classList.remove('rising')

  let timeout = 0
  if (animate) {
    timeout = 500
    sun.classList.add('setting')
  }

  setTimeout(() => {
    sun.classList.add('hidden')
    moon.classList.remove('hidden')
    document.documentElement.classList.add('dark')
    if (animate) moon.classList.add('rising')
  }, timeout)
}

// ===================== 当前页面菜单高亮 =====================
window.applyMenuItemClasses = () => {
  const menuItems = document.querySelectorAll('#menu a')
  for (const item of menuItems) {
    if (item.pathname === window.location.pathname) {
      item.classList.add('text-neutral-900', 'dark:text-white')
    }
  }
}

// ===================== 移动端菜单 =====================
function mobileMenuFunctionality() {
  document.getElementById('openMenu').addEventListener('click', openMobileMenu)
  document.getElementById('closeMenu').addEventListener('click', closeMobileMenu)
}

window.openMobileMenu = () => {
  document.getElementById('openMenu').classList.add('hidden')
  document.getElementById('closeMenu').classList.remove('hidden')
  document.getElementById('menu').classList.remove('hidden')

  const bg = document.getElementById('mobileMenuBackground')
  bg.classList.add('opacity-0')
  bg.classList.remove('hidden')
  setTimeout(() => bg.classList.remove('opacity-0'), 1)
}

window.closeMobileMenu = () => {
  document.getElementById('closeMenu').classList.add('hidden')
  document.getElementById('openMenu').classList.remove('hidden')
  document.getElementById('menu').classList.add('hidden')
  document.getElementById('mobileMenuBackground').classList.add('hidden')
}
